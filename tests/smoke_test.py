"""
Smoke test — setup_starter.py'i tmp dizine kurar, beklenen iskeleti dogrular.

3 senaryo:
  1. assistant kit + automation kategori (default LOW-RISK path)
  2. blank kit + general kategori (production doctrine + orchestrator-safety)
  3. assistant kit + finance kategori (HIGH-RISK auto-injects production doctrine)

Calistirma:
    python tests/smoke_test.py
    python -m tests.smoke_test
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

FOUNDATIONAL_SKILLS = [
    "grill-me",
    "skill-creator",
    "agent-creator",
    "project-advisor",
    "yardim",
    "suspend",
    "resume",
    "sync-drift",
    "ne-yapayim",
    "spagetti-check",
    "ubiquitous-language",
    "failing-test-as-prompt",
    "agent-approval",
    "verify-agent-output",
    "verifier-agent",
]

PRODUCTION_DOCTRINE_DOCS = [
    "auto-mode-classifier.md",
    "brain-hands-decoupling.md",
    "eval-awareness.md",
    "multi-grader-eval.md",
    "red-team-primitive.md",
]


def run(args: list[str]) -> int:
    return subprocess.run([sys.executable, str(SETUP), *args]).returncode


def check(condition: bool, msg: str) -> None:
    print(f"  {'OK' if condition else 'XX'} {msg}")
    if not condition:
        sys.exit(f"FAIL: {msg}")


def assert_template_invariants() -> None:
    """Pre-flight: template/ has the structure setup_starter expects."""
    print("\n=== Template invariants ===")
    vendored_agent = ROOT / "template" / ".claude" / "agents" / "prompt-engineer.md"
    check(vendored_agent.exists(), f"vendored agent in template: {vendored_agent.relative_to(ROOT)}")
    pe_text = vendored_agent.read_text(encoding="utf-8")
    check("name: prompt-engineer" in pe_text, "vendored agent has frontmatter")
    check("Security pass" in pe_text, "prompt-engineer includes security audit pass")

    skills_dir = ROOT / "template" / ".claude" / "skills"
    for s in FOUNDATIONAL_SKILLS:
        check((skills_dir / f"{s}.md").exists(), f"template skills/{s}.md exists")

    cat_dir = ROOT / "template" / "02-memory" / "category"
    cat_files = sorted(p.name for p in cat_dir.glob("*.md"))
    check(len(cat_files) == 10, f"10 category boilerplates (got {len(cat_files)}: {cat_files})")
    check("06-finance.md" in cat_files, "06-finance.md exists (HIGH-RISK)")
    check("07-legal.md" in cat_files, "07-legal.md exists (HIGH-RISK)")

    doc_dir = ROOT / "template" / "02-memory" / "doctrine"
    for d in PRODUCTION_DOCTRINE_DOCS:
        check((doc_dir / d).exists(), f"production doctrine doc: {d}")
    check((ROOT / "template" / "02-memory" / "orchestrator-safety.md").exists(),
          "orchestrator-safety.md exists")

    check((ROOT / "check.cmd").exists(), "check.cmd (Windows pre-flight) exists")
    check((ROOT / "check.sh").exists(), "check.sh (Mac/Linux pre-flight) exists")


def assert_doctrine_count(claude_md: str) -> None:
    """CLAUDE.md should have all 20 doctrines (including #15 orchestrator-only multi-agent)."""
    for n in range(1, 21):
        marker = f"- **{n}."
        check(marker in claude_md, f"doctrine #{n} present in CLAUDE.md")


def scenario_assistant_automation() -> None:
    print("\n=== Scenario 1: assistant + automation (LOW-RISK) ===")
    tmp = Path(tempfile.mkdtemp(prefix="lm-smoke-1-"))
    target = tmp / "demo"
    rc = run(["--yes", "--name=demo", f"--target={target}",
              "--kit=assistant", "--category=automation"])
    check(rc == 0, f"setup_starter exit 0 (got {rc})")

    check((target / "CLAUDE.md").exists(), "CLAUDE.md exists")
    claude_md = (target / "CLAUDE.md").read_text(encoding="utf-8")
    check("PROJECT_NAME" not in claude_md, "CLAUDE.md placeholders rendered")
    check("demo" in claude_md, "CLAUDE.md has project name")
    check("BEGIN: first-run onboarding" in claude_md, "CLAUDE.md has first-run onboarding block")
    check("Phase 0.3 — Proje kategorisi" in claude_md, "Phase 0.3 (kategori) present")
    assert_doctrine_count(claude_md)

    for s in FOUNDATIONAL_SKILLS:
        check((target / ".claude" / "skills" / f"{s}.md").exists(), f"skills/{s}.md copied")

    cat_file = target / "02-memory" / "category" / "01-automation.md"
    check(cat_file.exists(), "01-automation.md present")
    check(not (target / "02-memory" / "category" / "06-finance.md").exists(),
          "other-category 06-finance.md NOT present (filter works)")

    # assistant kit should NOT include production doctrine
    check(not (target / "02-memory" / "doctrine").exists(),
          "production doctrine docs SKIPPED for assistant kit")
    check(not (target / "02-memory" / "orchestrator-safety.md").exists(),
          "orchestrator-safety SKIPPED for assistant kit")

    # Phase 0.6 default = match → agent copied with default description (untouched)
    pe_path = target / ".claude" / "agents" / "prompt-engineer.md"
    check(pe_path.exists(), "prompt-engineer agent copied (default mode=match)")
    pe_text = pe_path.read_text(encoding="utf-8")
    check("Two-mode doctrine agent" in pe_text,
          "match-mode description preserved (default agent text)")

    shutil.rmtree(tmp, ignore_errors=True)


def scenario_prompt_engineer_modes() -> None:
    print("\n=== Scenario 4: Phase 0.6 prompt-engineer modes (off/aggressive/manual) ===")

    # mode=off → agent file should NOT exist
    tmp_off = Path(tempfile.mkdtemp(prefix="lm-smoke-4off-"))
    target_off = tmp_off / "demo"
    rc = run(["--yes", "--name=demo", f"--target={target_off}",
              "--kit=assistant", "--category=automation",
              "--prompt-engineer-mode=off"])
    check(rc == 0, f"mode=off setup_starter exit 0 (got {rc})")
    check(not (target_off / ".claude" / "agents" / "prompt-engineer.md").exists(),
          "mode=off → prompt-engineer.md NOT copied")
    shutil.rmtree(tmp_off, ignore_errors=True)

    # mode=aggressive → agent file copied with aggressive description
    tmp_agg = Path(tempfile.mkdtemp(prefix="lm-smoke-4agg-"))
    target_agg = tmp_agg / "demo"
    rc = run(["--yes", "--name=demo", f"--target={target_agg}",
              "--kit=assistant", "--category=automation",
              "--prompt-engineer-mode=aggressive"])
    check(rc == 0, f"mode=aggressive setup_starter exit 0 (got {rc})")
    pe_agg = target_agg / ".claude" / "agents" / "prompt-engineer.md"
    check(pe_agg.exists(), "mode=aggressive → agent copied")
    agg_text = pe_agg.read_text(encoding="utf-8")
    check("Always-on prompt structurizer" in agg_text,
          "aggressive description swapped in")
    check("Two-mode doctrine agent" not in agg_text,
          "default match description replaced (not duplicated)")
    shutil.rmtree(tmp_agg, ignore_errors=True)

    # mode=manual → manual description swapped
    tmp_man = Path(tempfile.mkdtemp(prefix="lm-smoke-4man-"))
    target_man = tmp_man / "demo"
    rc = run(["--yes", "--name=demo", f"--target={target_man}",
              "--kit=assistant", "--category=automation",
              "--prompt-engineer-mode=manual"])
    check(rc == 0, f"mode=manual setup_starter exit 0 (got {rc})")
    pe_man = target_man / ".claude" / "agents" / "prompt-engineer.md"
    check(pe_man.exists(), "mode=manual → agent copied")
    man_text = pe_man.read_text(encoding="utf-8")
    check("Manual-only invocation" in man_text,
          "manual description swapped in")
    shutil.rmtree(tmp_man, ignore_errors=True)


def scenario_blank_general() -> None:
    print("\n=== Scenario 2: blank + general (production opt-in) ===")
    tmp = Path(tempfile.mkdtemp(prefix="lm-smoke-2-"))
    target = tmp / "demo"
    rc = run(["--yes", "--name=demo", f"--target={target}",
              "--kit=blank", "--category=general", "--stack=python"])
    check(rc == 0, f"setup_starter exit 0 (got {rc})")

    # blank kit → production doctrine docs INCLUDED
    for d in PRODUCTION_DOCTRINE_DOCS:
        check((target / "02-memory" / "doctrine" / d).exists(),
              f"production doctrine {d} INCLUDED for blank kit")
    check((target / "02-memory" / "orchestrator-safety.md").exists(),
          "orchestrator-safety INCLUDED for blank kit")

    # general → no category boilerplate
    cat_dir = target / "02-memory" / "category"
    cat_files = sorted(p.name for p in cat_dir.glob("*.md")) if cat_dir.exists() else []
    check(len(cat_files) == 0, f"no category boilerplates for 'general' (got {cat_files})")

    shutil.rmtree(tmp, ignore_errors=True)


def scenario_finance_high_risk() -> None:
    print("\n=== Scenario 3: assistant + finance (HIGH-RISK auto-elevation) ===")
    tmp = Path(tempfile.mkdtemp(prefix="lm-smoke-3-"))
    target = tmp / "demo"
    rc = run(["--yes", "--name=demo", f"--target={target}",
              "--kit=assistant", "--category=finance"])
    check(rc == 0, f"setup_starter exit 0 (got {rc})")

    # HIGH-RISK kategori (finance) overrides assistant kit's no-production rule
    for d in PRODUCTION_DOCTRINE_DOCS:
        check((target / "02-memory" / "doctrine" / d).exists(),
              f"finance auto-includes {d} (HIGH-RISK override)")
    check((target / "02-memory" / "orchestrator-safety.md").exists(),
          "finance auto-includes orchestrator-safety")
    check((target / "02-memory" / "category" / "06-finance.md").exists(),
          "06-finance.md present")
    check(not (target / "02-memory" / "category" / "01-automation.md").exists(),
          "other-category 01-automation.md filtered out")

    # project-advisor must have HIGH-RISK section
    pa = (target / ".claude" / "skills" / "project-advisor.md").read_text(encoding="utf-8")
    check("06-finance.md" in pa, "project-advisor has finance-aware Step 1.5")
    check("Immutable audit log" in pa, "project-advisor checks immutable ledger")

    shutil.rmtree(tmp, ignore_errors=True)


def main() -> None:
    assert_template_invariants()
    scenario_assistant_automation()
    scenario_prompt_engineer_modes()
    scenario_blank_general()
    scenario_finance_high_risk()
    print("\n+++ All 4 scenarios passed. +++")


if __name__ == "__main__":
    main()
