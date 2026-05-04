---
name: verifier-agent
description: Use when the project needs an automated, parallel verifier that audits the primary agent's claims after every Stop hook. Adapted from IndyDevDan's "Verifier Agent" pattern (2026-05). Different from /verify-agent-output — this is the **architecture skill** that scaffolds the verifier as a parallel agent + Stop hook + atomic claim breakdown, not a one-shot manual check.
---

You are interviewing the user to scaffold a **verifier agent** — a parallel agent that runs automatically on every Stop hook of the primary builder agent, breaks the builder's claims into atomic units, validates each one, and writes a structured report. Adapted from IndyDevDan's pattern (AI Engineer 2026, video `EnXKysJNz_8`).

# When to use this skill

Trigger this skill when ANY of the following is true:
- User says "I want to verify what my agent does automatically" / "agent kontrol etsin"
- Multi-agent orchestrator (Phase 0.5 = `b`) → verifier per agent is a doctrine extension
- HIGH-RISK kategori (finance / legal) — verifier is essentially mandatory
- User reports "my agent says it did X but I'm not sure" → 2-3x → this skill is the structural answer
- User mentions IndyDevDan / Cursor / verifier-by-artifact pattern

# Difference from `/verify-agent-output`

| Aspect | `/verify-agent-output` | `/verifier-agent` (this skill) |
|--------|------------------------|------------------------------|
| Trigger | Manual, on-demand | Automatic on Stop hook |
| Scope | Single claim, one-shot | All claims of last builder turn |
| Output | One verification result | Structured atomic-claims report |
| Persistence | Conversation-scoped | Independent agent + log artifact |
| Setup cost | Zero (just call) | One-time scaffold (this skill) |

Use `/verify-agent-output` for ad-hoc *"is this number right?"*. Use `/verifier-agent` to **build** the always-on parallel auditor.

# Process

## Step 1 — Confirm fit (1 question)

Ask:
> *"Verifier agent **architecture skill**'i çağırdın. Bu, parallel agent + Stop hook + atomic claims report kuruyor. Şu an: (a) **scaffold yeni proje** (henüz verifier yok, baştan kur), (b) **mevcut verifier'i iyileştir** (var ama eksik / kırık), (c) **yanlış skill** (tek-seferlik claim kontrolü için `/verify-agent-output` çağır)?"*

If (c), redirect and stop.
If (a) or (b), continue to Step 2.

## Step 2 — Walk the design tree

Ask **one question at a time** (Pocock pattern). Recommended-default first, alternatives second.

### Branch 1 — Builder agent identity
*"Verifier hangi builder agent'ı denetleyecek? Default: ana Claude Code session. Alternatif: spesifik subagent (`.claude/agents/<name>.md`) veya başka harness'taki bir agent."*

### Branch 2 — Atomic claim taxonomy
*"Builder'in çıktısını hangi claim türlerine böleceğiz? Default 5 kategori (Cursor / IndyDevDan):*
- **Action claim** — *"X dosyasını yazdım", "Y endpoint'ini çağırdım"* → screenshot/log path zorunlu
- **Computation claim** — *"toplam = 42.50"* → bağımsız re-calc zorunlu
- **Data fetch claim** — *"API'den 17 satır geldi"* → response excerpt zorunlu
- **Code change claim** — *"foo.py'a fonksiyon ekledim"* → git diff zorunlu
- **State change claim** — *"DB'ye row insert ettim"* → SELECT verify zorunlu

*Alt: domain-specific (örn. casino bot için 'bet placed', 'spin observed', 'balance delta'). Domaine eklemek istediğin tür var mı?"*

### Branch 3 — Stop hook trigger mechanism
*"Verifier nasıl tetiklenecek? Default: `~/.claude/hooks/stop-verifier.sh` — Claude Code'un Stop hook'una bağlanır, builder turnünü yakalar, verifier'ı subprocess olarak çalıştırır.*

*Alt: (a) Cron / interval-based (5 dk'da bir), (b) explicit `/verify-now` slash command (agentic_pull tetik), (c) IPC over Unix socket (IndyDevDan'in seçimi — düşük latency, ama Unix-only)."*

### Branch 4 — Report format + storage
*"Verifier raporu nereye, nasıl yazacak? Default JSONL append-only:*
*`data/verifier/<date>/<turn-id>.jsonl` — her satır bir claim, fields: claim_id, type, status (verified/failed/unverifiable), evidence_path, feedback_for_builder, improvement_for_verifier_self.*

*Alt: SQLite, Markdown, OpenTelemetry span (OTLP exporter — Sam Witteveen Item 6)."*

### Branch 5 — Verifier model + budget
*"Verifier hangi modelle çalışacak? IndyDevDan recommendation: cheap model (GLM 5.1 / Haiku 4.5) — verifier 2-5x token harcayacak, primary'den ucuz olmalı.*

*Alt: same model as builder (deterministic comparison), Sonnet 4.6 (default), open model self-hosted (Llama / Mistral)."*

### Branch 6 — Re-prompt authority
*"Verifier rule violation bulduğunda ne yapsın? Default: **feedback report yaz, builder'ı re-prompt'la**. Bu IndyDevDan pattern'i — verifier `claim violated rule X` derse builder otomatik düzeltir.*

*Alt: (a) sadece raporla, kullanıcıya bildir (passive), (b) işi durdur (circuit-breaker — HIGH-RISK kategori için), (c) loop limit + max-retry (3'ten fazla violation → alarm)."*

### Branch 7 — Bash tool restriction
*"Verifier bash kullanacak mı? IndyDevDan: **EVET ama kısıtlı** — bash sadece tek bir verify-script'i çağırabilir, başka bash blocklu (Doctrine #11 hooks > prompts).*

*Alt: (a) full bash (low-risk projects), (b) bash hiç yok (read-only verifier — daha güvenli ama snapshot/log path veremez)."*

### Branch 8 — Verifier'in kendisini iyileştirme döngüsü
*"Verifier `improvement_for_verifier_self` field'i kullanılacak mı? Default EVET: verifier her turn'de 'şunu doğrulayamadım, X kuralı eklemem lazım' der → kullanıcı görür → bir sonraki turn için system prompt template'ine eklenir. Compounding feedback loop.*

*Alt: passif (sadece raporlar, self-improvement loop'u manuel)."*

## Step 3 — Stop when shared understanding reached

When user says *"yeter, başla"* / *"kur"*, produce:

```
## Shared understanding — verifier agent scaffold

- **Builder:** <Branch 1>
- **Claim types:** <Branch 2 — list>
- **Trigger:** <Branch 3>
- **Storage:** <Branch 4>
- **Verifier model:** <Branch 5>
- **Re-prompt authority:** <Branch 6>
- **Bash:** <Branch 7>
- **Self-improvement loop:** <Branch 8>

## Files to create
- `.claude/agents/verifier.md` — system prompt + atomic claim taxonomy
- `~/.claude/hooks/stop-verifier.sh` (or `.ps1` on Win) — Stop hook
- `scripts/run_verifier.py` — entrypoint that reads turn, calls verifier model, writes JSONL
- `data/verifier/.gitkeep` — log dir
- (optional) `prompts/verifier-system.md` — versioned prompt registry entry

## First step
1. `/grill-me` confirmed scope
2. Hand off → BUILD: write the 4 files above
3. Test with synthetic turn (mock builder output → run verifier → check JSONL)
4. Real turn — observe report
5. Iterate Branch 8 (self-improvement) over 1 week
```

Then ask: *"Bu scaffold ile uyumlu muyuz? Onayla → BUILD'e geçiyorum."*

If user confirms, hand off → BUILD mode (write the actual files). Don't write code in this skill — verifier-agent's job ends at scaffold spec.

# Hard rules

1. **One question at a time.** No batching the 8 branches.
2. **Recommend before asking.** Every branch has a default.
3. **Don't write code.** This skill produces a spec, not implementation.
4. **Stop when user says go.** They may know enough on Branch 4.
5. **Idempotent re-invocation.** If verifier already exists, default Branch 1 to "improve existing" (don't overwrite).

# Anti-patterns

- ❌ Skipping straight to code — verifier without taxonomy = un-tunable
- ❌ Verifier with full bash + same model + auto-reprompt → "Ouro" loop, slop compounding (AI Engineer 2026 — Mario "compounding boos" warning)
- ❌ Verifier prompted directly by user — defeats the whole point (out-of-loop is the value)
- ❌ Single binary status (✓/✗) — atomic claim breakdown is the differentiator vs. `/verify-agent-output`
- ❌ Skipping Branch 8 (self-improvement) — verifier becomes static, won't catch new failure modes

# Why this exists pre-shipped (one of 15 foundational)

Inner-loop test:
- **2-3x/day?** ✓ — every Stop hook of every nontrivial agent turn (auto-fires; no manual call)
- **Same pattern?** ✓ — atomic claim breakdown is structurally identical regardless of domain (only the taxonomy varies, scaffolded by this skill)
- **Preloaded context helps?** ✓ — IndyDevDan + Cursor + Sam Witteveen + Anthropic Engineering all converge on this pattern; pre-loading the design-tree saves the user from rediscovering it

Empirical signal triangulated across 4 sources (one-shot insight is one signal; **convergence across independent practitioners is N signals**):
- **IndyDevDan** (2026-05) — Verifier Agent pattern in production for 6+ months, two-agent system with Stop hook + atomic claims
- **Cursor** (2026-05) — agents now ship video evidence of action completion (verification-by-artifact, layermark-starter Doctrine #6 sub-rule)
- **Sam Witteveen** (2026-05) — "Must Haves For Agents in Production" includes per-trace eval as Item 7 (verifier is the runtime side of that)
- **Anthropic Engineering** (2026-05) — "demystifying evals" + "Project Vend" + auto-mode classifier all share the *"agent claim → independent verification path"* primitive

This skill graduates the convergent pattern into the foundational bundle. `/verify-agent-output` (one-shot) and `/verifier-agent` (architecture) are siblings — first answers *"is this number right?"*, second answers *"how do I make sure every number is checked, automatically, forever?"*.
