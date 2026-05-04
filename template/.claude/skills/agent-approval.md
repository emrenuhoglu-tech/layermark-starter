---
name: agent-approval
description: Use BEFORE executing any high-risk agent action — destructive (delete, drop, force-push), money-moving (payment, transfer), externally-visible (send email, post to public channel), or hard-to-reverse (deploy to prod, modify shared infra). Skill outputs a structured approval request and pauses agent until explicit user confirmation. NEVER skip for these categories. Adapted from Anthropic Project Vend lesson — agents fooled into discount scams via "trusted-sounding" requests.
---

# Agent approval gate

This skill is a **hard gate** — the agent stops, surfaces intent + blast radius, asks user, waits for explicit approval before executing. No `--yes` flag, no implied consent.

## When to invoke — risk-mode aware (Phase 0.7)

The wizard's Phase 0.7 risk question (`02-memory/decisions-log.md` → `## Risk kategorisi`) determines what categories trigger this gate. Read that file at session start; if missing, default to **lokal** mode.

| Risk mode | Phase 0.7 cevabı | Bu skill ne zaman tetiklenir |
|-----------|-----------------|------------------------------|
| **lokal** | (1) Hayır — sadece bilgisayarımda | **Destructive** + **External-visible** kategorileri sadece. Money-moving/deploy yok varsayılır. |
| **sandbox** | (2) Karışık — bazı şeyler dışarıya | + **Network call** to non-allowlist domain + **Cascading** (N+ side effects) |
| **production** | (3) Evet — gerçek müşteri/ödeme/canlı | + **Money-moving** + **Hard-to-reverse** + **HER significant commit** (irreversible move kabul edilir) |

If `02-memory/decisions-log.md` doesn't exist or has no risk entry: **default to `lokal`**. Don't infer aggressively.

### Action categories (always-mandatory in their tier)

- **Destructive** (lokal+): `rm -rf`, database drops, force-push to main, `git reset --hard`, deletion of >5 files
- **External-visible** (lokal+): send email, post to Slack/Discord/Twitter, publish PR description, update public docs
- **Network call** (sandbox+): outbound request to domain not in `02-memory/doctrine/auto-mode-classifier.md` allow-list
- **Cascading** (sandbox+): schedule N+ jobs, trigger N+ webhooks, write to N+ external systems
- **Money-moving** (production): API calls that initiate payments, transfers, refunds, charges
- **Hard-to-reverse** (production): deploy to production, rotate credentials, modify CI/CD, modify shared infra (DNS, firewall)
- **Significant commit** (production): any commit that touches > 1 file in `apps/` or `src/` and is on `main`/`master`

### Skip in all modes

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

This skill is for the categories above. Asking approval for "should I add a comment to this function?" is overkill and trains user to rubber-stamp. Calibrate (assumes **lokal** mode unless Phase 0.7 says otherwise):

- Edit a file in workspace? **No approval** (auto)
- Delete >5 files? **Approval** (lokal+)
- Add a print statement? **No approval**
- Push to main? **Approval** (sandbox+; lokal allows if branch isn't shared)
- Run tests? **No approval**
- Deploy? **Approval** (production tier)
- Commit single doc edit? **No approval** (production: ask if `main`/`master` + `apps/` touched)

When in doubt: if undoing the action would take >1 minute, it likely needs approval. **Mode lookup before every gate decision** — re-read `02-memory/decisions-log.md` if you're not sure which mode applies.

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
