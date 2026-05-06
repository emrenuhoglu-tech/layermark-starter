"""
Smoke test — setup_starter.py'i tmp dizine kurar, beklenen iskeleti dogrular.

5 senaryo + TTFF timing gate:
  1. assistant kit + automation kategori (default LOW-RISK path)
  2. blank kit + general kategori (production doctrine + orchestrator-safety)
  3. assistant kit + finance kategori (HIGH-RISK auto-elevation)
  4. Phase 0.6 prompt-engineer mode toggles (off/aggressive/manual)
  5. assistant kit + legal kategori (HIGH-RISK + legal-disclaimer-checker)

  + TTFF gate: setup must complete in < 15s (cold-start, non-tech UX)
  + settings.json validity: JSON parses, hooks registered, category-aware denies present
  + Hook scripts: present + python-syntax-valid

Calistirma:
    python tests/smoke_test.py
    python -m tests.smoke_test
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Smoke must test what EXTERNAL users see. Force vendored template path even if
# the dev's ~/.layermark/pylib/ has a stale internal copy. setup_starter.py
# checks os.environ["LAYERMARK_FORCE_TEMPLATE"] — child subprocess inherits.
os.environ["LAYERMARK_FORCE_TEMPLATE"] = "1"

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


TTFF_BUDGET_SEC = 15.0  # Time-to-first-feature: cold-start setup must finish under this.


def run(args: list[str]) -> int:
    return subprocess.run([sys.executable, str(SETUP), *args]).returncode


def run_timed(args: list[str]) -> tuple[int, float]:
    start = time.perf_counter()
    rc = subprocess.run([sys.executable, str(SETUP), *args]).returncode
    return rc, time.perf_counter() - start


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

    # Category-triggered agents (only loaded for matching categories)
    fin_agent = ROOT / "template" / ".claude" / "agents" / "finance-auditor.md"
    legal_agent = ROOT / "template" / ".claude" / "agents" / "legal-disclaimer-checker.md"
    check(fin_agent.exists(), "finance-auditor agent in template")
    check(legal_agent.exists(), "legal-disclaimer-checker agent in template")
    check("name: finance-auditor" in fin_agent.read_text(encoding="utf-8"),
          "finance-auditor has frontmatter")
    check("name: legal-disclaimer-checker" in legal_agent.read_text(encoding="utf-8"),
          "legal-disclaimer-checker has frontmatter")

    skills_dir = ROOT / "template" / ".claude" / "skills"
    for s in FOUNDATIONAL_SKILLS:
        check((skills_dir / f"{s}.md").exists(), f"template skills/{s}.md exists")

    # Hook scripts (PostToolUse activity tracker + Stop session snapshot)
    hooks_dir = ROOT / "template" / ".claude" / "hooks"
    for h in ("activity_tracker.py", "session_snapshot.py"):
        hp = hooks_dir / h
        check(hp.exists(), f"template hooks/{h} exists")
        # Validate Python syntax (import would have side effects; ast.parse is safe)
        import ast
        try:
            ast.parse(hp.read_text(encoding="utf-8"))
            check(True, f"hooks/{h} parses as valid Python")
        except SyntaxError as e:
            check(False, f"hooks/{h} has syntax error: {e}")

    # settings.json template registers both hooks + has permissions block
    settings_tmpl = ROOT / "template" / ".claude" / "settings.json.tmpl"
    check(settings_tmpl.exists(), "template settings.json.tmpl exists")
    settings_text = settings_tmpl.read_text(encoding="utf-8")
    check("activity_tracker.py" in settings_text, "settings.json registers activity_tracker hook")
    check("session_snapshot.py" in settings_text, "settings.json registers session_snapshot hook")
    check("{{CATEGORY_DENIES}}" in settings_text, "settings.json has CATEGORY_DENIES placeholder")

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


def assert_settings_json(target: Path, *, expect_category_denies: bool) -> None:
    """Every scenario should produce a parseable .claude/settings.json with hooks.

    expect_category_denies: True for finance/legal (extra deny rules), False for others.
    """
    settings_path = target / ".claude" / "settings.json"
    check(settings_path.exists(), ".claude/settings.json rendered")
    try:
        data = json.loads(settings_path.read_text(encoding="utf-8"))
        check(True, "settings.json parses as valid JSON")
    except json.JSONDecodeError as e:
        check(False, f"settings.json INVALID: {e}")
        return
    check("hooks" in data, "settings.json has hooks block")
    pre = data["hooks"].get("PostToolUse", [])
    stop = data["hooks"].get("Stop", [])
    check(len(pre) >= 1, "settings.json registers PostToolUse hook")
    check(len(stop) >= 1, "settings.json registers Stop hook")
    pre_cmd = pre[0]["hooks"][0]["command"] if pre and pre[0].get("hooks") else ""
    stop_cmd = stop[0]["hooks"][0]["command"] if stop and stop[0].get("hooks") else ""
    check("activity_tracker.py" in pre_cmd, "PostToolUse → activity_tracker.py")
    check("session_snapshot.py" in stop_cmd, "Stop → session_snapshot.py")

    deny_rules = data.get("permissions", {}).get("deny", [])
    check("Bash(rm -rf *)" in deny_rules, "settings.json denies rm -rf")
    if expect_category_denies:
        # finance OR legal — should have at least 1 extra deny rule beyond the standard 7
        check(len(deny_rules) > 7, f"category-aware denies present (got {len(deny_rules)} rules)")
    else:
        check(len(deny_rules) == 7, f"standard 7 deny rules (got {len(deny_rules)})")


def scenario_assistant_automation() -> None:
    print("\n=== Scenario 1: assistant + automation (LOW-RISK) ===")
    tmp = Path(tempfile.mkdtemp(prefix="lm-smoke-1-"))
    target = tmp / "demo"
    rc, elapsed = run_timed(["--yes", "--name=demo", f"--target={target}",
                              "--kit=assistant", "--category=automation"])
    check(rc == 0, f"setup_starter exit 0 (got {rc})")
    check(elapsed < TTFF_BUDGET_SEC,
          f"TTFF gate: setup completes < {TTFF_BUDGET_SEC}s (got {elapsed:.2f}s)")

    check((target / "CLAUDE.md").exists(), "CLAUDE.md exists")
    claude_md = (target / "CLAUDE.md").read_text(encoding="utf-8")
    check("PROJECT_NAME" not in claude_md, "CLAUDE.md placeholders rendered")
    check("demo" in claude_md, "CLAUDE.md has project name")
    check("BEGIN: first-run onboarding" in claude_md, "CLAUDE.md has first-run onboarding block")

    # llms.txt — LLM-friendly project index (Anthropic-coined standard pattern)
    llms_txt_path = target / "llms.txt"
    check(llms_txt_path.exists(), "llms.txt exists (LLM-friendly index)")
    llms_txt = llms_txt_path.read_text(encoding="utf-8")
    check("PROJECT_NAME" not in llms_txt, "llms.txt placeholders rendered")
    check("demo" in llms_txt, "llms.txt has project name")
    check("prompt-engineer.md" in llms_txt, "llms.txt indexes prompt-engineer agent")
    check("Phase 0.3 — Proje kategorisi" in claude_md, "Phase 0.3 (kategori) present")
    assert_doctrine_count(claude_md)

    for s in FOUNDATIONAL_SKILLS:
        check((target / ".claude" / "skills" / f"{s}.md").exists(), f"skills/{s}.md copied")

    cat_file = target / "02-memory" / "category" / "01-automation.md"
    check(cat_file.exists(), "01-automation.md present")
    check(not (target / "02-memory" / "category" / "06-finance.md").exists(),
          "other-category 06-finance.md NOT present (filter works)")

    # automation kategori — finance/legal agents copied edilmemeli
    check(not (target / ".claude" / "agents" / "finance-auditor.md").exists(),
          "automation kategori → finance-auditor NOT copied (filter)")
    check(not (target / ".claude" / "agents" / "legal-disclaimer-checker.md").exists(),
          "automation kategori → legal-disclaimer-checker NOT copied (filter)")

    # Hooks + settings.json (no category-aware denies for automation)
    check((target / ".claude" / "hooks" / "activity_tracker.py").exists(),
          "activity_tracker.py copied")
    check((target / ".claude" / "hooks" / "session_snapshot.py").exists(),
          "session_snapshot.py copied")
    assert_settings_json(target, expect_category_denies=False)

    # assistant kit should NOT include production doctrine
    check(not (target / "02-memory" / "doctrine").exists(),
          "production doctrine docs SKIPPED for assistant kit")
    check(not (target / "02-memory" / "orchestrator-safety.md").exists(),
          "orchestrator-safety SKIPPED for assistant kit")

    # Phase 0.6 default = match → agent copied with default description (untouched)
    pe_path = target / ".claude" / "agents" / "prompt-engineer.md"
    check(pe_path.exists(), "prompt-engineer agent copied (default mode=match)")
    pe_text = pe_path.read_text(encoding="utf-8")
    check("Three-mode doctrine agent" in pe_text,
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
    check("Three-mode doctrine agent" not in agg_text,
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

    # Finance kategori → finance-auditor agent copied; legal-disclaimer-checker NOT
    check((target / ".claude" / "agents" / "finance-auditor.md").exists(),
          "finance kategori → finance-auditor agent copied")
    check(not (target / ".claude" / "agents" / "legal-disclaimer-checker.md").exists(),
          "finance kategori → legal-disclaimer-checker NOT copied (cross-category filter)")

    # Finance settings.json: extra deny rules (Decimal pickle, ledger overwrite)
    assert_settings_json(target, expect_category_denies=True)
    settings = json.loads((target / ".claude" / "settings.json").read_text(encoding="utf-8"))
    deny = settings["permissions"]["deny"]
    check(any("pickle" in d for d in deny), "finance: pickle.load denied")
    check(any("transactions.csv" in d for d in deny), "finance: transactions.csv write denied")

    # project-advisor must have HIGH-RISK section
    pa = (target / ".claude" / "skills" / "project-advisor.md").read_text(encoding="utf-8")
    check("06-finance.md" in pa, "project-advisor has finance-aware Step 1.5")
    check("Immutable audit log" in pa, "project-advisor checks immutable ledger")

    shutil.rmtree(tmp, ignore_errors=True)


def scenario_legal_high_risk() -> None:
    print("\n=== Scenario 5: assistant + legal (HIGH-RISK + legal-disclaimer-checker) ===")
    tmp = Path(tempfile.mkdtemp(prefix="lm-smoke-5-"))
    target = tmp / "demo"
    rc = run(["--yes", "--name=demo", f"--target={target}",
              "--kit=assistant", "--category=legal"])
    check(rc == 0, f"setup_starter exit 0 (got {rc})")

    # Legal HIGH-RISK auto-elevation: production doctrine + legal category boilerplate
    for d in PRODUCTION_DOCTRINE_DOCS:
        check((target / "02-memory" / "doctrine" / d).exists(),
              f"legal auto-includes {d} (HIGH-RISK)")
    check((target / "02-memory" / "category" / "07-legal.md").exists(),
          "07-legal.md present")

    # Legal kategori → legal-disclaimer-checker copied; finance-auditor NOT
    check((target / ".claude" / "agents" / "legal-disclaimer-checker.md").exists(),
          "legal kategori → legal-disclaimer-checker agent copied")
    check(not (target / ".claude" / "agents" / "finance-auditor.md").exists(),
          "legal kategori → finance-auditor NOT copied (cross-category filter)")

    # Legal settings.json: PII/HTTP deny rules
    assert_settings_json(target, expect_category_denies=True)
    settings = json.loads((target / ".claude" / "settings.json").read_text(encoding="utf-8"))
    deny = settings["permissions"]["deny"]
    check(any("ssn" in d.lower() for d in deny), "legal: ssn keyword denied")
    check(any("tckn" in d.lower() for d in deny), "legal: tckn keyword denied")
    check(any("http://" in d for d in deny), "legal: plaintext HTTP denied")

    shutil.rmtree(tmp, ignore_errors=True)


def main() -> None:
    assert_template_invariants()
    scenario_assistant_automation()
    scenario_prompt_engineer_modes()
    scenario_blank_general()
    scenario_finance_high_risk()
    scenario_legal_high_risk()
    print("\n+++ All 5 scenarios passed. +++")


if __name__ == "__main__":
    main()
