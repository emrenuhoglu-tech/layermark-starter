---
name: premortem
description: Kahneman-style anti-bias plan stress-test. Assumes the plan ALREADY FAILED 6 months from now and surfaces the biggest hidden assumption + how it died. Defeats Claude's RLHF-trained approval-seeking bias by inverting the frame. Use when seeking honest stress-test of a forward-looking plan, architecture decision, or deployment strategy. Triggers ONLY on explicit invocation ("premortem", "ölü post-mortem", "bu plan nasıl çöker", "stress-test bu kararı", or `/premortem`) — NOT on plan-sharing alone.
---

# /premortem — anti-bias plan stress-test

## What this skill does

Asks the prompt-engineer agent in **PREMORTEM mode** to stress-test a forward-looking plan from a 6-months-from-now-already-dead frame. Output structure (load-bearing first):

1. **🎯 KILLER OUTPUT — biggest hidden assumption** (the load-bearing output; reading only this gives ~80% of the value)
2. **Quick verdict** — most-likely failure / most-dangerous failure / revised plan diff
3. **Failure scenarios (supporting detail)** — 5-7 scenarios, each with story + early warning sign + assumption exposed + base-rate cite + doctrine cite

## Why frame-flipping (not "what could go wrong")

When you ask Claude "is this a good plan?" the RLHF training pushes toward validation. Even "what could go wrong?" lets the model defend the plan while listing edge cases.

Premortem flips the premise: *the plan ALREADY failed.* There is nothing to validate — there is only the post-mortem to write. Optimism bias has nothing to attach to.

**Honest caveat:** frame-flipping is bias-INVERSION, not bias-elimination. The new failure mode is hallucinated catastrophe — confident, plausible-sounding scenarios that have no real precedent. The skill counters this with **mandatory base-rate citation** per scenario (see Hard requirements). Without that guard, premortem becomes creative-writing.

Daniel Kahneman framed this as a high-leverage decision technique; Google, Goldman Sachs, P&G use it before major launches. Don't oversell — it's a reframe pattern, not magic.

## When to use

- Before deploying multi-component systems (multi-agent, multi-tenant, multi-region)
- Before merging a doctrine change that will compound across the project
- Before committing to a new dependency, vendor, or architecture
- Before any decision where rolling back costs >1 week
- When a plan "feels too clean" — premortem catches what "feels right" missed

## When NOT to use

- For existing code/project review → use `/grill-me` or AUDIT mode (prompt-engineer)
- For a one-line bug fix → just BUILD mode
- As a synonym for "second opinion" — premortem is structured, not freeform
- After the plan is already executed — that's a real post-mortem, different artifact

## How to invoke

Paste your plan and say one of:

- `premortem this plan: <plan>`
- `bu planı premortem yap: <plan>`
- `ölü post-mortem yapalım, plan: <plan>`
- `stress-test bu kararı: <decision>`

Or, if you have `.claude/skills/premortem.md` configured in your slash-command list:

```
/premortem <paste your plan or reference a file>
```

The prompt-engineer agent picks up PREMORTEM mode from the trigger phrase and produces:

1. **Premortem summary** — plan restatement + frame statement
2. **5-7 failure scenarios** — each with story (past tense), early warning sign, exposed assumption, base-rate cite, doctrine cite
3. **Synthesis** — most likely / most dangerous / biggest hidden assumption / revised plan diff

## Hard requirements (enforced by prompt-engineer PREMORTEM mode)

- Premise stays failure throughout — no "but it might work" reassurance section
- Scenarios diversified across technical / operational / product / organizational pools
- Each scenario names a concrete causal chain — no vague "scaling issues"
- **Each scenario MUST cite a base rate**: prior project incident OR doctrine source OR explicit `[no precedent — speculative]` tag. Stops hallucinated catastrophe.
- Revised plan is a diff (ADD/CHANGE/REMOVE), not a fresh redesign
- Capped at 5-7 scenarios — more is padding, fewer is approval-seeking dressed as premortem

## Doctrine alignment

- **Pocock #11** ("hooks > prompt negatives") — premortem is the prompt-architecture hook that defeats RLHF approval bias deterministically
- **Anthropic eval-awareness** — same principle, different angle: model+harness can collude toward an outcome (here: validation); structural reframe breaks the collusion
- **Verification-by-artifact** (IndyDevDan) — every failure scenario must produce an actionable artifact (warning sign, base-rate cite, doctrine cite, plan diff), not vibes

## Relationship to other skills

- `/grill-me` — clarifies a fuzzy idea (BEFORE there's a plan)
- `/premortem` — stress-tests a clear plan (AFTER it's been formed, BEFORE execution)
- `prompt-engineer AUDIT` — inspects existing code/project (AFTER execution)

The flow: idea → /grill-me → plan → /premortem → revised plan → BUILD prompts → code → AUDIT.
