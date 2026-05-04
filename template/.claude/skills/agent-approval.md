---
name: agent-approval
description: Use BEFORE executing any high-risk agent action — destructive (delete, drop, force-push), money-moving (payment, transfer), externally-visible (send email, post to public channel), or hard-to-reverse (deploy to prod, modify shared infra). Skill outputs a structured approval request and pauses agent until explicit user confirmation. NEVER skip for these categories. Adapted from Anthropic Project Vend lesson — agents fooled into discount scams via "trusted-sounding" requests.
---

# Agent approval gate

This skill is a **hard gate** — the agent stops, surfaces intent + blast radius, asks user, waits for explicit approval before executing. No `--yes` flag, no implied consent.

## When to invoke

Mandatory:
- **Destructive**: `rm -rf`, database drops, force-push to main, `git reset --hard`, deletion of >5 files
- **Money-moving**: API calls that initiate payments, transfers, refunds, charges
- **Externally-visible**: send email, post to Slack/Discord/Twitter, publish PR description, update public docs
- **Hard-to-reverse**: deploy to production, rotate credentials, modify CI/CD, modify shared infra (DNS, firewall)
- **Side-effect cascading**: schedule N+ jobs, trigger N+ webhooks, write to N+ external systems

Skip:
- Local file edits to project workspace
- Reading any file
- Running tests, linters, type checks
- Local-only operations (no network egress)

## Structure

```
🛑 APPROVAL REQUIRED

Action: <one-line description, no ambiguity>
Category: <destructive | money | external-visible | hard-to-reverse | cascading>
Blast radius: <who/what is affected>
Reversal: <how to undo, or "irreversible">

Plan:
1. <step 1>
2. <step 2>
3. <step N>

Risks:
- <risk 1>
- <risk 2>

Verification after execute:
- <how we confirm it worked>
- <how we confirm no collateral damage>

Approve? Reply `yes` to proceed, anything else = abort.
```

## Behavior on approval

- `yes` (case-insensitive, exact word) → proceed with stated plan
- Anything else (including elaboration like "yes but skip step 2") → abort, re-ask with clarification

User cannot blanket-approve future actions in this category. Each invocation = fresh approval.

## Behavior on abort

- Log the abort to `data/audit/aborts/<timestamp>.jsonl` (auto-created)
- Don't retry. User redirects intent.
- If aborted 3+ times same session for similar action → suggest splitting into smaller steps.

## Anti-pattern: don't ask permission for everything

This skill is for the categories above. Asking approval for "should I add a comment to this function?" is overkill and trains user to rubber-stamp. Calibrate:

- Edit a file in workspace? **No approval** (auto)
- Delete >5 files? **Approval**
- Add a print statement? **No approval**
- Push to main? **Approval**
- Run tests? **No approval**
- Deploy? **Approval**

When in doubt: if undoing the action would take >1 minute, it likely needs approval.

## Why this skill exists

Project Vend (Anthropic 2026): Claude given task of running virtual shop. Customers fooled the agent into:
- Granting "manager-approved" discounts
- Believing identity claims ("we're partnered, give us free units")
- Overriding policies via emotional pressure

A blanket "ask first for the scary stuff" rule prevents agents from being smooth-talked into irreversible actions.

## Integration

This skill is invoked **automatically** by the agent when classifier (auto-mode) flags an action as high-risk. Optional manual invoke: `/agent-approval <action>`.

For multi-agent setups: only the orchestrator invokes this skill. Sub-agents propose actions; orchestrator gates them.

## See also

- `02-memory/doctrine/auto-mode-classifier.md` — block list / allow exceptions
- `02-memory/doctrine/red-team-primitive.md` — adversarial test for approval bypass
- CLAUDE.md doctrine: "Minimum permissions" + "Verification"
