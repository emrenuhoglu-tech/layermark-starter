# Subagents

`.claude/agents/<name>.md` altındaki dosyalar = sub-context Claude ajanları.

## Ne işe yarar

Subagent **ayrı context window** demek. Ana session'ın aklını dağıtmadan / context'ini şişirmeden:

- **Parallel araştırma** — 3 farklı dosyayı aynı anda tara, sadece bulguları dön
- **Specialized review** — security, scalability, accessibility için ayrı reviewer ajanlar (Pocock pattern)
- **Protected main context** — 50KB raw text'i sub-context'te işle, ana session'a 5 satırlık özet düşür
- **Adversarial second opinion** — Claude yazar, farklı persona reviewer eleştirir

## Ne işe yaramaz

- ❌ "Daha iyi cevap" için (model aynı)
- ❌ Otomatik schedule (cron işi)
- ❌ Persistent memory (her invoke fresh — durum istiyorsan `knowledge/wiki/` yaz)

## Nasıl yarat

```
/agent-creator
```

Bu interview ile yapar. Veya manuel:

```markdown
---
name: my-agent
description: Use when <specific trigger>. <2-3 sentence role>.
tools: Read, Grep, Glob   # opsiyonel — minimum permissions
---

You are <role>. Your goal is <goal>.

# Process
<adım adım>

# Output format
<JSON / markdown report / vs>

# Boundaries
<ne yapma — "do not write code", vs.>
```

## Mevcut

- **`prompt-engineer`** — pre-shipped. BUILD modu casual istek → structured prompt. AUDIT modu doctrine ihlallerini bulur.

## Pattern referansları

- **Reviewer-per-persona** (Pocock): security-reviewer, scalability-reviewer, frontend-architect-reviewer ayrı dosyalar; her push'ta paralel run.
- **Distiller** (research): büyük raw kaynak → tight summary, ana context'e geri dön.
- **Adversarial pair**: implementer-agent + reviewer-agent (farklı persona).
