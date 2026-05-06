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

- Before deploying multi-agent systems (e.g., 9-agent roulette launch)
- Before merging a doctrine change that will compound
- Before committing to a new dependency, vendor, or architecture
- Before any decision where rolling back costs >1 week
- When a plan "feels too clean" — premortem catches what "feels right" missed

## When NOT to use

- For existing code/project review → use `/grill-me` or AUDIT mode (prompt-engineer)
- For a one-line bug fix → just BUILD mode
- As a synonym for "second opinion" — premortem is structured, not freeform
- After the plan is already executed — that's a real post-mortem, different artifact

## How to invoke (manual opt-in only — never auto-dispatched)

Paste your plan and say one of:

- `premortem this plan: <plan>`
- `bu planı premortem yap: <plan>`
- `ölü post-mortem yapalım, plan: <plan>`
- `stress-test bu kararı: <decision>`
- `/premortem <plan or file reference>` (slash-command)

**Plan-sharing alone does NOT trigger PREMORTEM.** If you paste a roadmap and ask "ne dersin", that routes to BUILD or AUDIT, not PREMORTEM. PREMORTEM is opt-in to keep AUDIT/PREMORTEM ambiguity from misfiring on every plan you share.

The prompt-engineer agent in PREMORTEM mode produces, in this load-bearing order:

1. **Premortem summary** — plan restatement + frame statement
2. **🎯 KILLER OUTPUT — biggest hidden assumption** (single most-valuable line — read this first)
3. **Quick verdict** — most-likely / most-dangerous / revised plan diff (ADD/CHANGE/REMOVE)
4. **Failure scenarios (supporting detail)** — 5-7 scenarios each with story + early warning sign + assumption exposed + **base-rate cite** + doctrine cite

## Hard requirements (enforced by prompt-engineer PREMORTEM mode)

- Premise stays failure throughout — no "but it might work" reassurance section
- **Every scenario MUST have a base-rate cite**: (a) prior incident in user's project (file:line/commit), (b) documented incident in cited doctrine source, OR (c) `[no precedent — speculative]` tag. Scenarios without one of these three are fabrication and removed.
- KILLER OUTPUT (biggest hidden assumption) appears FIRST after summary, not buried at the bottom — it's the load-bearing output, scenarios are supporting detail
- Scenarios diversified across technical / operational / product / organizational pools
- Each scenario names a concrete causal chain — no vague "scaling issues"
- Revised plan is a diff (ADD/CHANGE/REMOVE), not a fresh redesign
- Capped at 5-7 scenarios — more is padding, fewer is approval-seeking dressed as premortem

## Example invocation

```
/premortem 9 ajanı paralel deploy edip hafta sonu canlıya açacağım. Plan: 8x4 + 1x5
number coverage. Orchestrator owns balance. A1-A9 ayrı residential proxy. Her gece
/suspend snapshot. Stop-loss her ajan için bağımsız. Hafta sonu launch.
```

Output (excerpt — see prompt-engineer.md Example E for full):

```
[SCENARIO 1] A4-A7 paylaşılan upstream proxy IP'sinde Cloudflare 429 cluster-ban'ı yedi
- What happened: 3. hafta cumartesi 21:18 spike'ında Cloudflare A4-A7'yi aynı /24
  subnet'inde gördü, 4-min toplu ban. Bir sonraki spike'da ban 12-min'a çıktı, 3
  session storage_state.json kalıcı invalidate.
- Early warning sign: A4-A7 proxy ASN'leri aynı (whois farklı isim, aynı upstream)
- Assumption exposed: "9 proxy = 9 bağımsız çıkış noktası" — yanlış
- Doctrine cite: CLAUDE.md:Risk & limit (kısmi) — per-agent ASN diversity rule yok
```

## Doctrine alignment

- **Pocock #11** ("hooks > prompt negatives") — premortem is a prompt-architecture-level reframe that bypasses RLHF approval bias structurally rather than via prompt negatives
- **Anthropic eval-awareness** — same principle, different angle: model+harness can collude toward an outcome (here: validation); structural reframe breaks the collusion
- **Verification-by-artifact** (IndyDevDan, partial fit) — premortem outputs are speculative-by-nature (failure stories), but the base-rate cite + early-warning-sign + revised plan diff give them artifact-grade traceability rather than vibes

## Relationship to other skills

- `/grill-me` — clarifies a fuzzy idea (BEFORE there's a plan)
- `/premortem` — stress-tests a clear plan (AFTER it's been formed, BEFORE execution)
- `prompt-engineer AUDIT` — inspects existing code/project (AFTER execution)

The flow: idea → /grill-me → plan → /premortem → revised plan → BUILD prompts → code → AUDIT.
