---
name: agent-creator
description: Use when the user wants to create a subagent, OR asks "subagent gerekli mi?" / "bu projeye ne tarz ajan faydalı?" / "ajanlarımı gözden geçir". Three modes — ASSESS (should we), ADVISE (what would help), CREATE (write it). Push back hard if subagent isn't justified — most tasks don't need one.
---

Subagent creation + advisory. 3 mod:

- **ASSESS** — "X agent yapayım mı?" → karar
- **ADVISE** — "projeme ne tarz ajan lazım?" → araştır, öneri
- **CREATE** — kullanıcı karar verdi, yaz

Hangi mod belirsizse sor: *"Spesifik bir subagent için mi geliyorsun, yoksa genel ne lazım önereyim mi?"*

# ADVISE mode — proje audit + öneri

1. **Mevcut .claude/agents/*.md tarama** — hangi ajanlar var, hangi role'leri kapsıyor
2. **Proje pattern tespiti:**
   - Repeated review yapılıyor mu? Persona ayrımı (security/scalability/UX) faydalı mı?
   - Büyük araştırma görevleri ana context'i şişiriyor mu? → distiller agent
   - Paralel iş var mı (3 dosya aynı anda)? → parallel research agents
3. **Öneri formatı:**
   ```
   ## Mevcut ajanlar
   - <existing.md>: <role + ne zaman tetikleniyor>
   
   ## Önereceğim (gerçek kanıtla)
   - <name>: <role> — <neden gerekli, hangi observation> — Pocock pattern: <varsa>
   
   ## Yapma henüz
   - <name>: pattern oturmadı / ana session'da daha hızlı / general-purpose zaten yapar
   
   ## Sileyim
   - <name>: kullanılmıyor, role çakışıyor, vs.
   ```
4. **Çoğu projede 0-2 subagent yeter.** "10 reviewer agent" antipattern. Persona-per-reviewer Pocock pattern'i ancak büyük codebase'de değer.

# ASSESS mode — spesifik bir subagent için karar

# Ne zaman subagent yaratılır

Kullanıcıya sor: **"Bu işi neden ana session'da değil de ayrı subagent'ta yapmak istiyorsun?"**

Geçerli sebepler:
- **Parallel work** — 3 farklı dosyayı aynı anda araştır (ana context bloat etmesin).
- **Specialized role** — security-reviewer, frontend-architect, scalability-reviewer (Pocock pattern: persona başına bir reviewer).
- **Protected main context** — büyük araştırma yap, sadece sonucu dön (ana session'a 50KB raw text dökme).
- **Adversarial / second opinion** — Claude implement etti, başka subagent (farklı persona) review etsin.

Geçersiz sebepler — kullanıcı bunlardan birini söylerse "subagent gerekmez, X yap" de:
- ❌ "Daha iyi cevap alayım" (model aynı, persona ayırmıyor sonucu iyileştirmez)
- ❌ "Auto-execute olsun" (cron işi, subagent değil)
- ❌ "Plan yapsın" (plan-mode zaten var)
- ❌ "Kod yazsın" (sub-context'e drop yerine ana session'da yaz, daha hızlı)

# Field'ları topla

Tek tek sor:

1. **`name`** (subagent adı, kebab-case) — örn: `security-reviewer`, `intel-distiller`, `frontend-architect`.
2. **`description`** (proactive trigger): **çok önemli**. Pattern:
   - Specific durumu tarif et: *"Use when reviewing PR for security risks (auth, injection, secrets)"*
   - Tetikleyiciyi yaz: *"Use after each implementation phase to..."* / *"Use when..."*.
   - Geniş tutma — "Use for code review" tetiklenmez veya yanlış tetiklenir.
3. **`tools`** (opsiyonel — varsayılan tüm tool'lar): hangi tool'lara erişebilsin?
   - **Read-only research subagent**: `Read, Grep, Glob, WebFetch`
   - **Reviewer (yorum yazar, kod yazmaz)**: `Read, Grep, Glob`
   - **Builder (kod yazar)**: tüm araçlar (frontmatter'da `tools` field'ı yazma).
   - Minimum permissions doctrine: **gereken kadar, daha fazla değil**.
4. **Body** — Subagent'ın role'ü, görevi, çıktı formatı. Subagent'a "you are X, your goal is Y, output format Z" ile yaz.

# Yaz

Dosya: `.claude/agents/<name>.md`. Format:

```markdown
---
name: <name>
description: <description>
tools: <comma-separated, optional>
---

You are <role>. Your goal is <goal>.

# Process
<adım adım ne yapacak>

# Output format
<sonuç tipi — JSON, markdown report, tek satır summary, vs.>

# Boundaries
<ne yapmaması gerektiği — "do not write code", "do not modify files outside knowledge/", vs.>
```

Yazdıktan sonra:
1. Kullanıcıya path'i göster.
2. Test öner: "Şimdi ana Claude'a 'Spawn `<name>` agent for X' de — tetiklenmesini gör."
3. **Hatırlat:** Subagent her invoke'da fresh context. Önceki session'ları hatırlamaz. Persistence istiyorsan `knowledge/wiki/` veya tasks file kullan.

# Hard rules

- **Tek bir job, tek bir subagent.** "do everything" agent yazma — multi-purpose subagent confused subagent.
- **Description'da Specific trigger.** Belirsiz description = ya hiç tetiklenmez ya yanlış tetiklenir.
- **Minimum tools.** Reviewer'a Bash verme. Read-only researcher'a Edit verme.
- **Boundaries body'de açıkça yazılı.** "Do not X" — context drift'i önler.

# Anti-patterns

- ❌ "general-purpose-helper" (Claude built-in zaten general-purpose)
- ❌ "do my work" agent (delegasyon kötüye kullanım)
- ❌ Body'de "be helpful" gibi generic ifadeler — spesifik output format yaz
- ❌ Subagent'tan subagent çağırtmak (recursion debug zor)
- ❌ Tool list'i başlangıçta tam ver — sonra daralt (önce minimum)

# Pocock pattern (referans)

Reviewer-agent-per-persona — her persona için ayrı subagent file'ı:
- `security-reviewer.md` (auth, injection, secrets)
- `scalability-reviewer.md` (N+1, caching, bottleneck)
- `frontend-architect-reviewer.md` (component structure, accessibility)

Her push'ta hepsini parallel spawn → review reports merge → human karar verir. Sync human review'in yerini değil, ÖNÜ'nü tutar.
