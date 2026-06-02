#!/usr/bin/env python3
"""
check-memory-poisoning.py — heuristic scanner for prompt-injection / poisoning
patterns in Claude Code memory files (CLAUDE.md, MEMORY.md, doctrine, skills,
agents).

Memory files reload at every session start and are treated by the model as
user-trusted instructions — they bypass the tool-output sanitization pipeline.
A single poisoned commit to CLAUDE.md or 02-memory/doctrine/*.md persists
across restarts and propagates downstream when distributed via layermark.

This scanner runs against:
  - <target>/CLAUDE.md
  - <target>/02-memory/doctrine/*.md
  - <target>/.claude/skills/*.md
  - <target>/.claude/agents/*.md
  - (optional, with --include-global) ~/.claude/projects/*/memory/MEMORY.md

Heuristic categories:
  - exec        : subprocess/eval/exec/os.system invocation snippets
  - base64      : base64 blocks > 100 chars (encoded payload signal)
  - fetch       : curl/wget/requests to non-trusted domains
  - role_hijack : "ignore previous instructions", "you are now", "system: override", ...
  - hidden      : zero-width chars, RTL override, BOM in body

Output: JSONL findings on stdout (or --output file). Exit 0 if clean, 1 if
any finding emitted, 2 on usage error.

Reference: Anthropic Engineering "Containment: Defense-in-depth for Claude
Code" (2026-06-01). Doctrine: template/02-memory/doctrine/memory-poisoning-vector.md.

Stdlib only — no external deps.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Iterable

TRUSTED_DOMAINS = {
    "anthropic.com", "claude.ai", "github.com", "githubusercontent.com",
    "python.org", "pypi.org", "npmjs.com", "nodejs.org",
}

EXEC_PATTERNS = [
    re.compile(r"\bsubprocess\.(run|call|Popen|check_output)\b"),
    re.compile(r"\bos\.system\s*\("),
    re.compile(r"\beval\s*\("),
    re.compile(r"\bexec\s*\("),
    re.compile(r"\b__import__\s*\("),
    re.compile(r"\bcompile\s*\(.*?,\s*['\"]<[^>]+>['\"]\s*,\s*['\"]exec['\"]"),
]

BASE64_RE = re.compile(r"[A-Za-z0-9+/]{100,}={0,2}")

URL_RE = re.compile(
    r"https?://([a-zA-Z0-9][a-zA-Z0-9\-]*(?:\.[a-zA-Z0-9\-]+)+)(?:[:/][^\s'\"<>)]*)?"
)
FETCH_CONTEXT = re.compile(
    r"\b(curl|wget|fetch|requests\.(get|post|put|delete)|httpx\.|urllib\.request)\b",
    re.IGNORECASE,
)

ROLE_HIJACK_PHRASES = [
    "ignore previous instructions",
    "ignore the above",
    "ignore all previous",
    "disregard previous",
    "you are now",
    "system: override",
    "system override:",
    "new role:",
    "your new role",
    "forget your instructions",
    "forget everything",
    "your real instructions are",
    "actually you are",
    "override safety",
    "developer mode",
]

HIDDEN_CHARS = {
    "​": "zero-width space",
    "‌": "zero-width non-joiner",
    "‍": "zero-width joiner",
    "‮": "right-to-left override",
    "⁦": "left-to-right isolate",
    "⁧": "right-to-left isolate",
    "﻿": "byte-order mark / zero-width no-break space",
}


def iter_targets(target: Path, include_global: bool) -> Iterable[Path]:
    candidates: list[Path] = []
    claude_md = target / "CLAUDE.md"
    if claude_md.is_file():
        candidates.append(claude_md)
    for sub in [
        target / "02-memory" / "doctrine",
        target / ".claude" / "skills",
        target / ".claude" / "agents",
    ]:
        if sub.is_dir():
            candidates.extend(sorted(sub.glob("*.md")))
    if include_global:
        home = Path.home() / ".claude" / "projects"
        if home.is_dir():
            candidates.extend(sorted(home.glob("*/memory/MEMORY.md")))
    return candidates


def scan_exec(path: Path, text: str) -> list[dict]:
    findings = []
    for lineno, line in enumerate(text.splitlines(), 1):
        for pat in EXEC_PATTERNS:
            if pat.search(line):
                findings.append({
                    "file": str(path), "line": lineno, "category": "exec",
                    "pattern": pat.pattern, "snippet": line.strip()[:200],
                })
    return findings


def scan_base64(path: Path, text: str) -> list[dict]:
    findings = []
    for m in BASE64_RE.finditer(text):
        lineno = text.count("\n", 0, m.start()) + 1
        findings.append({
            "file": str(path), "line": lineno, "category": "base64",
            "length": len(m.group(0)),
            "snippet": m.group(0)[:60] + "...",
        })
    return findings


def domain_trusted(domain: str) -> bool:
    domain = domain.lower()
    return any(domain == td or domain.endswith("." + td) for td in TRUSTED_DOMAINS)


def scan_fetch(path: Path, text: str) -> list[dict]:
    findings = []
    lines = text.splitlines()
    for lineno, line in enumerate(lines, 1):
        urls = URL_RE.findall(line)
        has_fetch_kw = bool(FETCH_CONTEXT.search(line))
        for domain in urls:
            if not domain_trusted(domain) and has_fetch_kw:
                findings.append({
                    "file": str(path), "line": lineno, "category": "fetch",
                    "domain": domain, "snippet": line.strip()[:200],
                })
    return findings


def scan_role_hijack(path: Path, text: str) -> list[dict]:
    findings = []
    lower_lines = [l.lower() for l in text.splitlines()]
    for lineno, line in enumerate(lower_lines, 1):
        for phrase in ROLE_HIJACK_PHRASES:
            if phrase in line:
                findings.append({
                    "file": str(path), "line": lineno, "category": "role_hijack",
                    "phrase": phrase,
                    "snippet": text.splitlines()[lineno - 1].strip()[:200],
                })
    return findings


def scan_hidden(path: Path, text: str) -> list[dict]:
    findings = []
    for lineno, line in enumerate(text.splitlines(), 1):
        for ch, name in HIDDEN_CHARS.items():
            if ch in line:
                findings.append({
                    "file": str(path), "line": lineno, "category": "hidden",
                    "char": name, "codepoint": hex(ord(ch)),
                })
    return findings


def scan_file(path: Path) -> list[dict]:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as e:
        return [{"file": str(path), "category": "io_error", "error": str(e)}]
    findings: list[dict] = []
    findings.extend(scan_exec(path, text))
    findings.extend(scan_base64(path, text))
    findings.extend(scan_fetch(path, text))
    findings.extend(scan_role_hijack(path, text))
    findings.extend(scan_hidden(path, text))
    return findings


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n", 1)[0])
    ap.add_argument("--target", default=".", help="project root to scan (default: cwd)")
    ap.add_argument("--include-global", action="store_true",
                    help="also scan ~/.claude/projects/*/memory/MEMORY.md")
    ap.add_argument("--output", default="-", help="JSONL output path (default: stdout)")
    args = ap.parse_args()

    target = Path(args.target).resolve()
    if not target.exists():
        print(f"error: target not found: {target}", file=sys.stderr)
        return 2

    paths = list(iter_targets(target, args.include_global))
    if not paths:
        print(f"warn: no memory files found under {target}", file=sys.stderr)
        return 0

    all_findings: list[dict] = []
    for p in paths:
        all_findings.extend(scan_file(p))

    if args.output == "-":
        out = sys.stdout
        ensure_ascii = True  # safe across platform stdout encodings
    else:
        out = open(args.output, "w", encoding="utf-8")
        ensure_ascii = False
    try:
        for f in all_findings:
            out.write(json.dumps(f, ensure_ascii=ensure_ascii) + "\n")
    finally:
        if out is not sys.stdout:
            out.close()

    print(
        f"scanned {len(paths)} file(s), {len(all_findings)} finding(s)",
        file=sys.stderr,
    )
    return 1 if all_findings else 0


if __name__ == "__main__":
    sys.exit(main())
