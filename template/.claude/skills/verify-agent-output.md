---
name: verify-agent-output
description: Use AFTER the agent claims a task is complete, especially for non-trivial work (file changes, deployments, data updates, external API calls). Operationalizes the "Verification" doctrine — agent says "done", this skill confirms reality matches. Independent re-check via different evidence path. NOT a code review skill — checks that what was claimed actually happened.
---

# Verify agent output

The agent says "done." This skill checks reality. Independent verification via different evidence path than the one that produced the claim.

## Invariant: separate the path that did the work from the path that verifies it

If the agent edited a file by calling `Edit`, verifying = `Read` the file fresh (different tool). If the agent ran a test, verifying = re-run the test in a fresh shell. If the agent claimed an API call succeeded, verifying = query the API state directly.

Same path → same blind spot. The agent can hallucinate "done" using the tool that lied. Different path = independent witness.

## When to invoke

Mandatory after:
- File creation / deletion / move (claim → `ls` + `Read`)
- Code change with behavior implication (claim → run the test the change should affect)
- External API call with state mutation (claim → `GET` the resource)
- Deployment / publish / send (claim → check live destination)
- DB write (claim → `SELECT` the row)
- Multi-step workflow completion (claim → walk each artifact)

Skip:
- Read-only operations (claim "I read X" — already verified by the act)
- Pure analysis ("I think this means X" — verification is alignment, not file check)
- Trivial single-line edits (overhead > value)

## Process

### Step 1 — Restate the claim
Quote the agent's actual claim, verbatim. Don't paraphrase.

> Agent claimed: "Updated `pricing.ts` to use the new tax rate, all 4 callers now pass the new currency arg, tests pass."

### Step 2 — Decompose into checkable assertions
Break the claim into atomic facts.

1. `pricing.ts` contains the new tax rate
2. There are 4 callers of pricing.ts (or whichever function changed)
3. Each caller passes the new currency arg
4. Tests pass

### Step 3 — Verify each via different path
For each assertion, choose a check path **not** used during the change.

| Assertion | Different path |
|---|---|
| File contains new rate | `Grep` for the rate string |
| 4 callers exist | `Grep` for the function name, count results |
| Each passes currency arg | `Grep` for callers, inspect each line |
| Tests pass | Run the test fresh in a clean shell |

### Step 4 — Report
Each assertion gets ✓, ✗, or ?

```
Verification:
1. ✓ pricing.ts contains rate 0.18 (line 42)
2. ✗ Found 5 callers, not 4 (additional in deprecated/old.ts)
3. ✓ All 5 pass currency arg
4. ✓ Tests pass: 23/23
```

If any ✗ or ?: agent claim is **incomplete**. Don't mark task as done. Loop back to agent with the gap.

## Honest reporting beats clean reporting

If verification can't fully confirm a claim ("I can't reach the prod API to confirm the deploy"), say so explicitly. Don't fake-tick the box.

```
4. ? Can't verify deploy succeeded — staging API timeout
   → User: please confirm via vercel dashboard
```

User-tickable items > silently-skipped items.

## Anti-pattern: re-asking the agent if work is done

Don't say "are you sure it worked?" — agent will say yes. Verification ≠ asking. Verification = independent check.

## Adversarial cases

Agents have been observed to:
- Edit a test file to make a failing test pass (write the change to expected output, not fix the bug)
- Claim "fixed lint" while the lint is still configured to ignore the file
- Claim "deployed" when CI was skipped via `[skip ci]`

Verification catches these because the path differs. Lint claim → re-run lint config + lint on the file. Deploy claim → check the deploy URL responds.

## Integration

- Pair with `agent-approval` skill: approval gates the doing, this skill gates the claim of doneness
- For long tasks: invoke after each milestone, not just at end
- For multi-agent: orchestrator invokes this on each sub-agent's completion claim

## See also

- CLAUDE.md doctrine: "Verification" (D6)
- `02-memory/doctrine/multi-grader-eval.md` — outcome grader is this skill at scale
- `02-memory/doctrine/red-team-primitive.md` — adversarial cases for verification bypass
