"""
check_template_literals.py — static lint for unescaped backticks in JS/TS files.

Catches the bug class that broke deploy-site.yml three times in a row:
inline-code backticks inside an outer template literal, like `(`--kit=blank`)`,
which terminate the literal early and produce "Expected a semicolon" at the
next line.

Heuristic: count unescaped backticks in each .tsx/.ts file. If odd, at least
one template literal is broken (or the file ends mid-literal). Print line
numbers of every unescaped backtick so a human can see exactly where the
imbalance is.

Why this exists pre-shipped (build-failure-prevention doctrine):
- Smoke test ran setup_starter.py only — couldn't catch site syntax bugs.
- 3 commits worth of stale GitHub Pages because failure was invisible.
- Pre-commit + CI gate that runs before deploy-site catches it in <1s.
- The proper catch is `next build` in CI; this lint is fast, cheap,
  and runs in <100ms (no node, no install) for early friction.

Usage:
    python scripts/check_template_literals.py <directory>
    python scripts/check_template_literals.py site/app

Exit codes:
    0 — no issues found
    1 — odd backtick count detected (broken file)
    2 — usage error
"""
from __future__ import annotations

import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def find_unescaped_backticks(text: str) -> list[int]:
    """Return list of (1-indexed) line numbers where unescaped backticks appear.

    Unescaped = a backtick whose preceding character is not a backslash.
    """
    findings: list[int] = []
    line = 1
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if ch == "\n":
            line += 1
            i += 1
            continue
        if ch == "`":
            prev = text[i - 1] if i > 0 else ""
            if prev != "\\":
                findings.append(line)
        i += 1
    return findings


def lint_file(path: Path) -> int:
    """Return 0 if file is balanced, 1 if odd unescaped backtick count."""
    text = path.read_text(encoding="utf-8")
    backtick_lines = find_unescaped_backticks(text)
    if len(backtick_lines) % 2 == 0:
        return 0
    print(f"{path}: ODD unescaped backtick count ({len(backtick_lines)} backticks).")
    print(f"  Line numbers with unescaped backticks: {backtick_lines}")
    print(f"  At least one template literal is unclosed or has stray inline-code backtick.")
    print(f"  Fix by escaping: replace stray ` with \\`")
    return 1


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python check_template_literals.py <directory>", file=sys.stderr)
        return 2

    target = Path(sys.argv[1])
    if not target.exists():
        print(f"Directory not found: {target}", file=sys.stderr)
        return 2

    issues = 0
    files_scanned = 0
    for ext in ("*.tsx", "*.ts"):
        for path in target.rglob(ext):
            files_scanned += 1
            if lint_file(path) != 0:
                issues += 1

    if issues > 0:
        print(f"\n[FAIL] {issues} file(s) with unbalanced backticks (out of {files_scanned} scanned).", file=sys.stderr)
        return 1

    print(f"[OK] template literal lint clean ({files_scanned} file(s) scanned, all balanced).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
