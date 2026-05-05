# Build failure prevention (3-layer system)

**Origin:** May 2026, layermark-starter site deploys failed silently 3 commits in a
row (`dd1f206 → d181135 → 34412ad`) because the smoke CI only tested
`setup_starter.py`, not the Next.js site build. Live `/start` page kept serving
the previous successful build while the maintainer pushed "fixed" code that
never reached users. Cost: 2 hours of misdiagnosed user testing.

**Lesson:** if it's not in CI, it'll silently rot. Pocock Doctrine #11
("hooks > prompt negatives") + Anthropic verification doctrine #6 — build
verification at every layer.

## Layer 1 — PREVENT (pre-commit, local)

**Catch the bug on dev's laptop, not in CI 5 minutes later.**

- `scripts/install_hooks.sh` installs a Git pre-commit hook
- On every `git commit`:
  - If `site/**` changed → run `cd site && npm run build` (catches template
    literal escapes, TS errors, lockfile drift)
  - If `setup_starter.py` / `template/**` / `tests/**` changed → run
    `python tests/smoke_test.py`
- Failure blocks the commit; emergency bypass only via `LAYERMARK_SKIP_HOOK=1`
  (never use to merge broken code)

**Cost:** 30 sec per site-touching commit. Worth it.

## Layer 2 — DETECT (CI gate + auto-issue)

**If the prevent layer is bypassed (or doesn't apply), CI catches it; if CI
fails, the maintainer is notified.**

### `.github/workflows/smoke.yml`
- Job `setup-starter` — runs smoke (5 scenarios) on Python 3.10 + 3.12
- Job `site-build` — runs `next build` with proper basePath
- **Both required for the PR/push to be considered "green"**

### `.github/workflows/deploy-failure-alert.yml`
- Triggers on `workflow_run` event for "Deploy site to GitHub Pages" with
  `conclusion == 'failure'`
- Auto-creates a GitHub issue:
  - Title: `🚨 Deploy failed: <sha> — <commit msg>`
  - Body: workflow URL, commit author, common failure classes, fix runbook
  - Labels: `deploy-failure`, `priority-high`
- De-dup: if an issue for the same SHA is already open, do nothing
- **Result:** maintainer sees an open red-flagged issue at session start

## Layer 3 — AUTO-FIX (autonomous, narrow scope)

**For a tight set of common failure classes, dispatch a remote Claude routine
to draft a fix PR.**

**Status:** research phase — not shipped autonomously yet. The risk of
unsupervised code fixes outweighs the benefit until pattern library is wider.

**Plan (when shipped):**
- Routine triggers off `deploy-failure` issue creation
- Reads the workflow run log via `gh run view --log-failed`
- Pattern-matches against known classes:
  - Unescaped backtick in template literal → escape
  - `Cannot find module 'X'` → check `package.json` typo
  - `Expected a semicolon` → grep file:line, attempt minimal lint
  - `Type 'X' is not assignable to 'Y'` → DON'T auto-fix, escalate
- Fix goes to a branch + PR, NOT direct push
- Maintainer reviews + merges

## Failure modes this catches

| Failure class | Layer 1 catch? | Layer 2 catch? | Layer 3 fix? |
|---------------|----------------|-----------------|---------------|
| Unescaped backtick in template literal | ✅ next build | ✅ next build | ✅ pattern match |
| TypeScript type error | ✅ next build | ✅ next build | ❌ escalate |
| Missing dependency | ✅ npm install | ✅ npm install | ❌ escalate |
| `setup_starter.py` syntax error | ✅ smoke | ✅ smoke | ❌ escalate |
| Missing skill in template | ✅ smoke | ✅ smoke | ❌ escalate |
| Network flake during deploy | ❌ (deploy-only) | ✅ alert | ✅ retry |
| Github Pages CDN propagation lag | ❌ | ⚠ false-alarm | ❌ wait |

## Anti-patterns (don't do these)

- ❌ Skip pre-commit hook because "it's a small change" — small changes break too
- ❌ Add `--no-verify` to git commit alias — defeats the gate entirely
- ❌ Auto-merge PR before CI green — bypasses Layer 2
- ❌ Auto-fix bot pushes directly to main — Layer 3 must use PR
- ❌ Treat smoke green as "site is live" — deploy-site is a separate workflow

## Source

- 2026-05-05 incident report: 3 stranded commits, build broken, user-test failed
- Pocock Doctrine #11 — "hooks > prompt negatives" (deterministic enforcement)
- Doctrine #6 (Verification) — build artifact = verification proof, not just type check
- Industry standard: GitLab/CircleCI/GitHub PR-required-checks pattern
