"""
Smoke test — setup_starter.py'i tmp dizine kurar, beklenen iskeleti dogrular.

Calistirma:
    python tests/smoke_test.py
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
SETUP = ROOT / "setup_starter.py"


def run(args: list[str]) -> int:
    return subprocess.run([sys.executable, str(SETUP), *args]).returncode


def check(condition: bool, msg: str) -> None:
    print(f"  {'✓' if condition else '✗'} {msg}")
    if not condition:
        sys.exit(f"FAIL: {msg}")


def main() -> None:
    # Guard: vendored agent must live in the template (so external clones work without pylib)
    vendored_agent = ROOT / "template" / ".claude" / "agents" / "prompt-engineer.md"
    check(vendored_agent.exists(), f"vendored agent in template: {vendored_agent.relative_to(ROOT)}")
    check("name: prompt-engineer" in vendored_agent.read_text(encoding="utf-8"), "vendored agent has frontmatter")

    tmp = Path(tempfile.mkdtemp(prefix="starter-smoke-"))
    target = tmp / "demo"

    print(f"\n→ Smoke test: {target}\n")

    # Run with --yes (CI mode)
    rc = run(["--yes", "--name=demo", f"--target={target}", "--stack=python", "--intel", "--watchlist=ai", "--kb"])
    check(rc == 0, f"setup_starter.py exit 0 (got {rc})")

    # Required files
    check((target / "CLAUDE.md").exists(), "CLAUDE.md exists")
    claude_md = (target / "CLAUDE.md").read_text(encoding="utf-8")
    check("PROJECT_NAME" not in claude_md, "CLAUDE.md placeholders rendered")
    check("demo" in claude_md, "CLAUDE.md has project name")
    check("BEGIN: first-run onboarding" in claude_md, "CLAUDE.md has first-run onboarding block")
    check("END: first-run onboarding" in claude_md, "CLAUDE.md onboarding block has END marker")
    check("Phase 1 — What & Why" in claude_md, "CLAUDE.md onboarding has Phase 1 questions")
    check((target / "README.md").exists(), "README.md exists")
    check((target / ".gitignore").exists(), ".gitignore exists")
    check((target / ".env.example").exists(), ".env.example exists")
    check((target / ".claude" / "skills" / "README.md").exists(), "skills/README.md exists")
    check((target / "knowledge" / "README.md").exists(), "knowledge/README.md exists")

    # Optional pieces
    check((target / ".claude" / "agents" / "prompt-engineer.md").exists(), "prompt-engineer agent copied")
    check((target / "scripts" / "intel_scan.py").exists(), "intel_scan.py copied (intel=true)")
    check((target / "scripts" / "x_intel_scan.py").exists(), "x_intel_scan.py copied")
    check((target / "config" / "watchlists.yaml").exists(), "watchlists.yaml created (preset=ai)")
    check((target / "knowledge" / "raw").is_dir(), "knowledge/raw/ created (kb=true)")
    check((target / "knowledge" / "wiki").is_dir(), "knowledge/wiki/ created")
    check((target / "knowledge" / "schema.md").exists(), "knowledge/schema.md created")
    check((target / "requirements.txt").exists(), "requirements.txt (stack=python)")
    check((target / "pyproject.toml").exists(), "pyproject.toml (stack=python)")

    # Watchlist content sanity
    wl = (target / "config" / "watchlists.yaml").read_text(encoding="utf-8")
    check("Anthropic" in wl, "watchlist preset 'ai' includes Anthropic")
    check("AnthropicAI" in wl, "watchlist 'ai' includes AnthropicAI handle")

    print(f"\n✓ All checks passed. Cleaning up {tmp}.")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
