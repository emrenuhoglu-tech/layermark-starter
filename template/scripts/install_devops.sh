#!/usr/bin/env bash
# install_devops.sh — opt-in DevOps pattern installer for layermark-starter projects.
#
# Walks Y/N through 7 patterns; generates only what you pick. Stack-aware
# (detects Python/Node/Web automatically). Skips patterns that don't apply
# (e.g. eval CI gate only shown for production-tier projects).
#
# Usage:
#   bash scripts/install_devops.sh
#
# Patterns offered (see 02-memory/doctrine/devops-patterns.md):
#   1. Pre-commit hook (local PREVENT)
#   2. CI smoke (GitHub Actions)
#   3. Deploy failure alert
#   4. Weekly project-advisor cron
#   5. Drift detection (only if knowledge/ exists)
#   6. Daily intel cron (only if scripts/intel_scan.py exists)
#   7. Eval CI gate (only if production-mode in decisions-log.md)
#
# Each pattern can be re-installed (script overwrites with confirmation).

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Detect stack
HAS_PYTHON=$([ -f "requirements.txt" ] || [ -f "pyproject.toml" ] && echo 1 || echo 0)
HAS_NODE=$([ -f "package.json" ] && echo 1 || echo 0)
HAS_WEB=$([ -f "tsconfig.json" ] && echo 1 || echo 0)
HAS_TESTS=$([ -d "tests" ] && echo 1 || echo 0)
HAS_KB=$([ -d "knowledge" ] && echo 1 || echo 0)
HAS_INTEL=$([ -f "scripts/intel_scan.py" ] && echo 1 || echo 0)
IS_PROD=$(grep -q "production" 02-memory/decisions-log.md 2>/dev/null && echo 1 || echo 0)
HAS_GIT_REMOTE=$(git remote -v 2>/dev/null | grep -q "github.com" && echo 1 || echo 0)

ask_yn() {
  local prompt="$1"
  local default="${2:-N}"
  local hint=$([ "$default" = "Y" ] && echo "[Y/n]" || echo "[y/N]")
  read -rp "  $prompt $hint " ans
  ans="${ans:-$default}"
  [[ "$ans" =~ ^[Yy] ]] && return 0 || return 1
}

mkdir -p .github/workflows

echo "========================================================================"
echo "  Layermark DevOps installer — opt-in pattern picker"
echo "========================================================================"
echo
echo "  Detected:"
echo "    Python project:    $([ $HAS_PYTHON = 1 ] && echo yes || echo no)"
echo "    Node project:      $([ $HAS_NODE = 1 ] && echo yes || echo no)"
echo "    Web (TS) project:  $([ $HAS_WEB = 1 ] && echo yes || echo no)"
echo "    tests/ folder:     $([ $HAS_TESTS = 1 ] && echo yes || echo no)"
echo "    knowledge/ folder: $([ $HAS_KB = 1 ] && echo yes || echo no)"
echo "    intel pipeline:    $([ $HAS_INTEL = 1 ] && echo yes || echo no)"
echo "    production-mode:   $([ $IS_PROD = 1 ] && echo yes || echo no)"
echo "    GitHub remote:     $([ $HAS_GIT_REMOTE = 1 ] && echo yes || echo no)"
echo
echo "  Patterns marked [skip] don't apply to your project shape."
echo "  Each pattern: see 02-memory/doctrine/devops-patterns.md"
echo "========================================================================"
echo

# ─── Pattern 1: Pre-commit hook ─────────────────────────────────────────────
echo "[1/7] Pre-commit hook (local PREVENT)"
echo "      Runs the right test before every commit. Bypass with"
echo "      LAYERMARK_SKIP_HOOK=1 in emergencies."
if ask_yn "      Install?" "N"; then
  HOOK="$REPO_ROOT/.git/hooks/pre-commit"
  cat > "$HOOK" << 'HOOK_EOF'
#!/usr/bin/env bash
[ "${LAYERMARK_SKIP_HOOK:-0}" = "1" ] && exit 0
set -e
cd "$(git rev-parse --show-toplevel)"
staged="$(git diff --cached --name-only --diff-filter=ACMR)"

if [ -f "package.json" ] && echo "$staged" | grep -qE '\.(ts|tsx|js|jsx)$'; then
  if grep -q '"build"' package.json; then
    echo "[pre-commit] frontend changed → npm run build..."
    npm run build > /tmp/precommit.log 2>&1 || { tail -30 /tmp/precommit.log; exit 1; }
  fi
fi

if [ -f "requirements.txt" ] && [ -d "tests" ] && echo "$staged" | grep -qE '\.py$'; then
  echo "[pre-commit] python changed → pytest..."
  python -m pytest tests/ > /tmp/precommit.log 2>&1 || { tail -30 /tmp/precommit.log; exit 1; }
fi

exit 0
HOOK_EOF
  chmod +x "$HOOK"
  echo "      ✓ Installed: .git/hooks/pre-commit"
else
  echo "      [skipped]"
fi
echo

# ─── Pattern 2: CI smoke ────────────────────────────────────────────────────
echo "[2/7] CI smoke (GitHub Actions)"
if [ $HAS_GIT_REMOTE = 0 ]; then
  echo "      [skip] No GitHub remote — GitHub Actions need a remote."
else
  echo "      Runs build/test on every push + PR. Required-check for merge."
  if ask_yn "      Install?" "Y"; then
    cat > .github/workflows/smoke.yml << 'WF_EOF'
name: Smoke
on:
  push:
    branches: [main, master]
  pull_request:
  workflow_dispatch:

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        if: ${{ hashFiles('requirements.txt') != '' || hashFiles('pyproject.toml') != '' }}
        with:
          python-version: '3.12'
      - name: Python install
        if: ${{ hashFiles('requirements.txt') != '' }}
        run: pip install -r requirements.txt
      - name: Pytest
        if: ${{ hashFiles('tests/') != '' && (hashFiles('requirements.txt') != '' || hashFiles('pyproject.toml') != '') }}
        run: python -m pytest tests/

      - uses: actions/setup-node@v4
        if: ${{ hashFiles('package.json') != '' }}
        with:
          node-version: 20
          cache: npm
      - name: Node install
        if: ${{ hashFiles('package.json') != '' }}
        run: npm ci || npm install
      - name: Node build
        if: ${{ hashFiles('package.json') != '' }}
        run: npm run build --if-present
      - name: Node test
        if: ${{ hashFiles('package.json') != '' }}
        run: npm test --if-present
WF_EOF
    echo "      ✓ Installed: .github/workflows/smoke.yml"
  else
    echo "      [skipped]"
  fi
fi
echo

# ─── Pattern 3: Deploy failure alert ────────────────────────────────────────
echo "[3/7] Deploy failure alert (auto-issue on deploy fail)"
if [ $HAS_GIT_REMOTE = 0 ]; then
  echo "      [skip] No GitHub remote."
else
  echo "      If you have a 'Deploy' or 'Pages' workflow that can fail silently,"
  echo "      this opens a GitHub issue automatically. Edit the workflow name"
  echo "      after install."
  if ask_yn "      Install?" "N"; then
    cat > .github/workflows/deploy-failure-alert.yml << 'WF_EOF'
name: Deploy failure alert
on:
  workflow_run:
    workflows: ["Deploy"]   # ← change this to YOUR deploy workflow name
    types: [completed]
permissions: { contents: read, issues: write, actions: read }
jobs:
  alert:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const run = context.payload.workflow_run;
            const sha = run.head_sha.substring(0, 7);
            const msg = run.head_commit.message.split('\n')[0].substring(0, 80);
            await github.rest.issues.create({
              owner: context.repo.owner, repo: context.repo.repo,
              title: `🚨 Deploy failed: ${sha} — ${msg}`,
              body: `Workflow: ${run.html_url}\nCommit: \`${sha}\`\nFix runbook: see 02-memory/doctrine/build-failure-prevention.md`,
              labels: ['deploy-failure', 'priority-high'],
            });
WF_EOF
    echo "      ✓ Installed: .github/workflows/deploy-failure-alert.yml"
    echo "      ⚠ EDIT the 'Deploy' workflow name to match yours."
  else
    echo "      [skipped]"
  fi
fi
echo

# ─── Pattern 4: Weekly project-advisor cron ─────────────────────────────────
echo "[4/7] Weekly project-advisor cron"
echo "      Runs /project-advisor skill via GitHub Action every Monday."
echo "      Alternative: claude.ai/code Routines (cleaner, requires Claude.ai)"
if [ $HAS_GIT_REMOTE = 0 ]; then
  echo "      [skip] No GitHub remote — use claude.ai/code Routines instead."
else
  if ask_yn "      Install GitHub Action version?" "N"; then
    cat > .github/workflows/weekly-advisor.yml << 'WF_EOF'
name: Weekly project advisor
on:
  schedule:
    - cron: '0 9 * * 1'  # Mondays 09:00 UTC
  workflow_dispatch:
permissions: { contents: read, issues: write }
jobs:
  advise:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Open advisory issue
        uses: actions/github-script@v7
        with:
          script: |
            const today = new Date().toISOString().substring(0, 10);
            await github.rest.issues.create({
              owner: context.repo.owner, repo: context.repo.repo,
              title: `Weekly review — ${today}`,
              body: `Run \`/project-advisor\` in Claude Code on this repo and paste findings here.\n\nChecklist:\n- [ ] Doctrine drift?\n- [ ] Unused skills?\n- [ ] Stale memory entries?\n- [ ] Missing test coverage?`,
              labels: ['advisory', 'weekly'],
            });
WF_EOF
    echo "      ✓ Installed: .github/workflows/weekly-advisor.yml"
  else
    echo "      [skipped]"
  fi
fi
echo

# ─── Pattern 5: Drift detection ─────────────────────────────────────────────
echo "[5/7] Drift detection (knowledge base)"
if [ $HAS_KB = 0 ]; then
  echo "      [skip] No knowledge/ folder."
else
  echo "      Compares raw/ timestamps to wiki/ refs. Pre-commit warning."
  echo "      [skip — pattern stub not implemented yet; see /sync-drift skill]"
fi
echo

# ─── Pattern 6: Daily intel cron ────────────────────────────────────────────
echo "[6/7] Daily intel cron"
if [ $HAS_INTEL = 0 ]; then
  echo "      [skip] No scripts/intel_scan.py."
elif [ $HAS_GIT_REMOTE = 0 ]; then
  echo "      [skip] No GitHub remote."
else
  echo "      Daily YouTube/X scan; commits 02-memory/youtube-intel/<date>.md."
  if ask_yn "      Install?" "N"; then
    cat > .github/workflows/intel-scan.yml << 'WF_EOF'
name: Daily intel scan
on:
  schedule:
    - cron: '0 6 * * *'  # 06:00 UTC daily
  workflow_dispatch:
permissions: { contents: write }
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r requirements.txt
      - run: python scripts/intel_scan.py
        env:
          YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
      - name: Commit if changed
        run: |
          git config user.name "intel-bot"
          git config user.email "bot@local"
          git add 02-memory/youtube-intel/
          git diff --cached --quiet || git commit -m "intel: $(date +%Y-%m-%d)"
          git push
WF_EOF
    echo "      ✓ Installed: .github/workflows/intel-scan.yml"
    echo "      ⚠ Add YOUTUBE_API_KEY to GitHub repo secrets before first run."
  else
    echo "      [skipped]"
  fi
fi
echo

# ─── Pattern 7: Eval CI gate ────────────────────────────────────────────────
echo "[7/7] Eval CI gate (production-mode only)"
if [ $IS_PROD = 0 ]; then
  echo "      [skip] Phase 0.7 risk-mode is not 'production'."
else
  echo "      Runs eval rubric on PR; blocks merge on regression."
  echo "      [skip — pattern stub; see 02-memory/doctrine/multi-grader-eval.md]"
fi
echo

echo "========================================================================"
echo "  Installation complete."
echo "  Review the doctrine: 02-memory/doctrine/devops-patterns.md"
echo "  Re-run anytime: bash scripts/install_devops.sh"
echo "========================================================================"
