#!/usr/bin/env bash
# install_hooks.sh — install local Git pre-commit hook for layermark-starter.
#
# What this hook does:
#   - If site/ files changed in the staged commit → runs `next build` locally
#     (catches template literal escape errors, TS errors, etc. before push).
#   - If setup_starter.py / template/ / tests/ changed → runs smoke test.
#   - Skips silently if no relevant files changed.
#
# Why: build-failure-prevention doctrine. Local catch is <30s; CI catch is
# 2-5 min round-trip. Pre-commit is the right gate for the dev's machine.
#
# Install:
#   bash scripts/install_hooks.sh
#
# Uninstall:
#   rm .git/hooks/pre-commit

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HOOK_PATH="$REPO_ROOT/.git/hooks/pre-commit"

cat > "$HOOK_PATH" << 'HOOK_EOF'
#!/usr/bin/env bash
# layermark-starter pre-commit hook (auto-installed by scripts/install_hooks.sh)
# Skip if env LAYERMARK_SKIP_HOOK=1 (rare emergencies; never use to merge broken code).
[ "${LAYERMARK_SKIP_HOOK:-0}" = "1" ] && exit 0

set -e
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# What files changed in this commit (staged)?
staged="$(git diff --cached --name-only --diff-filter=ACMR)"

# Gate 1: site/ changes → next build (catches the template literal bug class)
if echo "$staged" | grep -qE '^site/'; then
  echo "[pre-commit] site/ changed → running site build smoke (next build)..."
  cd site
  if ! npm run build > /tmp/layermark-prebuild.log 2>&1; then
    echo
    echo "[pre-commit] FAIL: site build broke. Last 30 lines of log:"
    echo "================================================================"
    tail -30 /tmp/layermark-prebuild.log
    echo "================================================================"
    echo
    echo "Full log: /tmp/layermark-prebuild.log"
    echo "Fix the build, re-stage, and commit again."
    echo "Emergency bypass (NOT recommended): LAYERMARK_SKIP_HOOK=1 git commit ..."
    exit 1
  fi
  echo "[pre-commit] site build OK."
  cd "$REPO_ROOT"
fi

# Gate 2: setup_starter.py / template/ / tests/ → smoke test
if echo "$staged" | grep -qE '^(setup_starter\.py|template/|tests/)'; then
  echo "[pre-commit] setup_starter / template / tests changed → running smoke..."
  if ! python tests/smoke_test.py > /tmp/layermark-presmoke.log 2>&1; then
    echo
    echo "[pre-commit] FAIL: smoke test failed. Last 30 lines:"
    echo "================================================================"
    tail -30 /tmp/layermark-presmoke.log
    echo "================================================================"
    echo "Fix the test, re-stage, and commit again."
    exit 1
  fi
  echo "[pre-commit] smoke OK."
fi

exit 0
HOOK_EOF

chmod +x "$HOOK_PATH"
echo "[install] pre-commit hook installed: $HOOK_PATH"
echo "[install] to uninstall: rm $HOOK_PATH"
echo "[install] to bypass once (emergencies only): LAYERMARK_SKIP_HOOK=1 git commit ..."
