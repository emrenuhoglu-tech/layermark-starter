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

## Parent verification gate (mandatory post-spawn)

The prompt-engineer subagent treats Hard requirements as soft instructions — empirically, even with imperative wording, output ships with `tool_uses: 0`, no KILLER OUTPUT heading, and no base-rate cites. This is an LLM coachability gap, not a prompt gap.

**Parent CLAUDE (the agent that spawned the subagent) MUST verify three criteria on the returned output before relaying it to the user.** Mechanical check, not soft talimat.

### Verification criteria

After receiving the subagent output:

1. **Abort signal first.** If output contains `PREMORTEM aborted — required doctrine sources unreadable`, that is the spec's graceful fail (Step P1). Relay verbatim to user; skip remaining checks.
2. **Tool usage > 0.** Subagent's reported `tool_uses` must be ≥1 (typically 2-4 for required Read calls). `tool_uses == 0` means doctrine wasn't actually read — every "Doctrine pulled" cite is hallucinated. Reject.
3. **KILLER OUTPUT heading.** Output must contain the literal string `🎯 KILLER OUTPUT`. If absent, P4 template was bypassed. Reject.
4. **Base-rate cite per scenario.** For each `### [SCENARIO N]` block (or scenario-equivalent heading), require a `Base rate:` line containing one of: (a) `file:line` / `commit <hash>` / memory entry cite, (b) doctrine-source incident cite, (c) literal `[no precedent — speculative]` tag. Even one scenario missing all three = reject (fabrication).

### Re-spawn protocol on failure

Re-spawn prompt-engineer with explicit error context:

```
Previous PREMORTEM output failed parent verification gate:
- Criterion failed: <tool usage / KILLER OUTPUT heading / base-rate cite>
- Evidence: <tool_uses=0 | missing literal "🎯 KILLER OUTPUT" | scenario N has no Base rate: line>

Re-run PREMORTEM mode honoring these (file: .claude/agents/prompt-engineer.md):
- Step P1: Read ~/.claude/CLAUDE.md AND project CLAUDE.md before generating scenarios.
- Step P3: Output MUST contain literal heading "🎯 KILLER OUTPUT — biggest hidden assumption".
- Step P2: Each scenario MUST have a "Base rate:" line with (a) prior incident cite, (b) doctrine-cited incident, OR (c) [no precedent — speculative] tag.

Original plan: <restate plan>
```

Cap at 2 re-spawn attempts. If still failing after 2 retries, deliver output with explicit `## ⚠ Verification failed` header noting which criteria broke — don't silently relay broken premortem.

### Why parent-level (not agent-file)

The agent file IS the subagent's system prompt. Adding self-check logic there asks the failing agent to police itself — the same approval bias PREMORTEM exists to defeat. Verification belongs to the orchestrator, aligned with Doctrine #6 (verification-by-artifact: claims need external verifier, not self-attestation).

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
