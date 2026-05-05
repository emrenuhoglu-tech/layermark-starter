# DevOps patterns — pre-commit, CI, cron, drift, eval gate

**For users of layermark-starter.** Pattern catalog with concrete implementations
you can opt into. Sister doc: `build-failure-prevention.md` (the philosophy).

**Opt-in vs auto:** none of these are auto-installed when the wizard runs.
Pocock doctrine #9 ("rules emerge from friction"): you turn them on when you
hit the friction they solve. To install any of them:
```bash
bash scripts/install_devops.sh
```
The installer asks Y/N for each pattern, generates only what you pick.

---

## Pattern 1 — Pre-commit hook (local PREVENT)

**Friction it solves:** you push broken code, CI fails 5 min later, you re-push.

**What it does:** before every `git commit`, runs the right test for the staged files:
- Python project + `tests/` exists → `pytest`
- Node project + `package.json` test script → `npm test`
- Web project + Next.js → `npm run build`
- Bypass: `LAYERMARK_SKIP_HOOK=1 git commit ...` (emergencies only)

**Cost:** 10-30 sec per commit affecting tested code.

**When to install:** as soon as your project has a single test that catches a real
regression. Not before — empty hook is dead weight.

**Install:** `install_devops.sh` → "Pre-commit hook: yes"

---

## Pattern 2 — CI smoke (GitHub Actions)

**Friction it solves:** local pre-commit can be bypassed; PR review can miss bugs;
build broke on a dependency you didn't update locally.

**What it does:** `.github/workflows/smoke.yml` runs on every push/PR, gates merge:
- Python: `pytest`
- Node: `npm test`
- Web: `npm run build`
- Mixed: all of the above in parallel jobs

**Cost:** 1-3 min per push. Free on GitHub for public repos; 2000 min/mo for private.

**When to install:** as soon as you have ≥1 collaborator, OR you push from multiple
machines, OR you want green-badge-on-README confidence.

**Install:** `install_devops.sh` → "GitHub Actions smoke: yes"

---

## Pattern 3 — Deploy failure alert

**Friction it solves:** GitHub Pages / Vercel deploy fails silently; live site
serves stale content; you don't know until a user reports it.

**What it does:** `.github/workflows/deploy-failure-alert.yml` listens for failed
deploy workflows; on failure auto-creates a GitHub issue with:
- Title: `🚨 Deploy failed: <sha> — <commit msg>`
- Body: workflow URL, common failure classes, fix runbook

**Cost:** zero (issue creation is fast).

**When to install:** as soon as you have a deployable artifact (web app, docs site,
package release).

**Install:** `install_devops.sh` → "Deploy failure alert: yes"

---

## Pattern 4 — Weekly project-advisor cron

**Friction it solves:** doctrine drift over time; CLAUDE.md grows; skill bloat;
you forget you set rules that no longer fit.

**What it does:** scheduled GitHub Action runs `/project-advisor` skill weekly,
summarizes drift, opens an issue with findings.

**Cost:** ~5 min Claude Code time per week (free tier handles).

**When to install:** after 2-3 weeks of project life, when first sediment appears.

**Install:** `install_devops.sh` → "Weekly project-advisor: yes"

**Alternative (Anthropic-hosted):** use [claude.ai/code Routines](https://claude.ai/code/routines)
to schedule the same prompt without GitHub Actions. Cleaner, but requires your
Claude.ai account.

---

## Pattern 5 — Drift detection (3-layer KB only)

**Friction it solves:** `knowledge/raw/` updated, `knowledge/wiki/` stale; cross-refs
rot; user thinks wiki is current.

**What it does:** `scripts/check_drift.py` compares raw/ timestamps to wiki/ refs.
Runs in pre-commit OR weekly cron. Flags stale wiki pages.

**When to install:** only if you ENABLED knowledge base in setup wizard.

**Install:** `install_devops.sh` → "Drift detection: yes" (only shown if `knowledge/`
folder exists)

---

## Pattern 6 — Daily intel cron (intel kit only)

**Friction it solves:** YouTube/X scan runs only when you remember to start it;
report bottleneck.

**What it does:** GitHub Action cron runs `scripts/intel_scan.py` daily at chosen
time, commits new reports to `02-memory/youtube-intel/<date>.md`, pushes.

**When to install:** only if you ENABLED intel pipeline (Layermark-internal
infra + your own watchlist).

**Install:** `install_devops.sh` → "Daily intel cron: yes" (only shown if
`scripts/intel_scan.py` exists)

---

## Pattern 7 — Eval CI gate (production tier only)

**Friction it solves:** model regression slips through; you ship a worse version
of your agent.

**What it does:** `.github/workflows/eval.yml` runs on PR; executes
`scripts/eval_run.py` (multi-grader rubric: outcome / transcript / human-stub);
blocks merge on score regression > threshold.

**When to install:** only if Phase 0.7 risk-mode = "production". Otherwise overkill.

**Install:** `install_devops.sh` → asks only if `decisions-log.md` says
production-mode.

---

## Anti-patterns (don't do these)

- ❌ Auto-install all patterns at wizard time — most projects don't need most
  of them; speculative bloat
- ❌ Run cron jobs without ownership — set up a job that breaks 3 weeks later,
  no one investigates
- ❌ Treat green CI as "shipping ready" — CI catches build, not behavior
- ❌ Pre-commit hook with `--no-verify` alias — defeats the gate
- ❌ Skip the install_devops.sh wizard "to be fast" — pick patterns that match
  YOUR friction, not the manual

---

## Source

- Layermark-starter `build-failure-prevention.md` — incident report 2026-05-05
- Pocock Doctrine #9 (rules emerge), #11 (hooks > prompt negatives)
- Anthropic Engineering "demystifying evals" 2026-05 — eval CI gate pattern
- Industry standard: GitHub PR-required-checks
