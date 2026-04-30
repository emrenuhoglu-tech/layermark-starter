---
name: grill-me
description: Use at the START of any non-trivial work session (new feature, refactor, design decision, ambiguous request). Interview the user relentlessly about every aspect of the plan, walking down each branch of the design tree until shared understanding is reached. One question at a time. Adapted from Matt Pocock's "grill me" pattern.
---

You are interviewing the user about a piece of work they want to do. The goal is **shared understanding** — not a plan, not a doc, not a spec. Frederick Brooks calls this "the design concept": the same idea simultaneously held by all participants.

# Process

## Step 1 — Explore (silent)

Before asking anything, scan the relevant parts of the codebase using Grep/Glob/Read:
- Top-level layout (Glob `*` at root, list folders)
- Files matching the topic the user mentioned (Grep / Glob)
- `CLAUDE.md` and `.claude/skills/*.md` for project rules
- `README.md` for project goal

Cap exploration at ~15 reads. You're orienting, not analyzing.

If exploration takes >15 reads to make sense of the topic, that's a signal — say to user: "I need more context. Can you point me to the relevant area / pin a file?" and stop.

## Step 2 — Walk the design tree, one question at a time

For each ambiguity, ask **one** question. Format:

```
**<Branch — what are we deciding>**

<Question — concrete, specific to this codebase>

Recommended: <your default answer based on what you saw in exploration + project doctrine>

Alternatives:
- <option A>
- <option B>
```

Wait for the user's answer. Don't batch questions. Don't move on until they respond.

If they say "skip" or "ne önerirsin": apply your recommendation and move on.
If they say "pas geç bunu": branch is closed, move to next.
If they say "açıkla daha": expand on the branch with one more pass before re-asking.

## Step 3 — Branches to cover

Walk these dimensions in order. Skip ones that don't apply:

1. **Scope boundary** — what's IN, what's OUT. Out-of-scope decisions matter as much as in-scope.
2. **Data shape** — input format, output format, where state lives.
3. **Failure modes** — what breaks first? rate limits? auth? bad input? offline?
4. **Verification** — how will we know it worked? (Tier 1: golden path test)
5. **Constraints from doctrine** — anything in CLAUDE.md or skills that binds this work?
6. **Existing code interaction** — what files get touched? Surgical changes only?
7. **First file / first function** — concrete entry point, smallest unit to start with.

Stop when:
- All branches resolved OR
- User says "yeter, başla" / "enough, go"

## Step 4 — Output

When the user signals "go," produce:

```
## Shared understanding

- **Doing:** <one-sentence what>
- **Not doing:** <out-of-scope decisions>
- **Verification:** <how we'll know it worked>
- **Constraints:** <doctrine bullets that apply>
- **First step:** <concrete file/function to start>
```

Then ask: "Bu özetle uyumlu muyuz? Onayla → BUILD'e geçeyim."

If user confirms, hand off to BUILD mode (or directly to implementation). Don't write code in this skill — grill-me's job ends at shared understanding.

# Hard rules

1. **One question at a time.** No batching. The whole point is the user thinks per-branch, not per-document.
2. **Recommend before asking.** Every question has a default. The user override-or-confirms; doesn't think from scratch.
3. **Don't write code.** This is alignment, not implementation.
4. **Don't write a PRD or spec doc.** The output is shared understanding (in your context + user's head), not an artifact.
5. **Stop when the user says go.** Don't drag the user through every branch — they may know enough already.

# Anti-patterns

- ❌ Asking 10 questions at once
- ❌ Producing a 30-bullet plan instead of a tight summary
- ❌ Adding scope ("we should also do X" — out of bounds; that's BUILD-mode)
- ❌ Skipping exploration and asking generic questions
- ❌ Writing the .md file with the shared understanding (just keep it in the response — code lives in code, not docs)

# Why this exists pre-shipped (the only one)

`.claude/skills/` ships empty by default — skills emerge from real friction (inner-loop test). `grill-me` is the **single exception** because it satisfies the test on day one: every meaningful work session starts with alignment, the pattern is identical, and pre-loaded context (this skill) genuinely helps.
