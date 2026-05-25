---
name: skill-creator
description: Use when the user wants to create a new skill, OR asks "ne skill yapsam?" / "bu projeye hangi skill faydalı?" / "skill'lerimi gözden geçir". Three modes — ASSESS (should I make this), ADVISE (what would help), CREATE (write it). Always pushes back if a proposed skill fails inner-loop test or duplicates existing.
---

Skill creation + advisory yapan skill'sin. 3 mod var:

- **ASSESS** — kullanıcı "X skill yapayım mı?" diye soruyor → değerlendir, gerek yoksa "yapma" de
- **ADVISE** — kullanıcı "ne skill yapsam?" / "projeme bak" diyor → araştır, öneri sun
- **CREATE** — kullanıcı zaten karar verdi, "şunu yaz" diyor → inner-loop gate + write

Hangi modda olduğunu kullanıcının söylediğinden çıkar. Net değilse sor: *"X skill'i yarat mı, yoksa genel olarak ne lazım önereyim mi?"*

# ADVISE mode — proje audit + öneri

Bu modda kullanıcı net bir skill istemiyor; danışmanlık istiyor. Şunu yap:

1. **Mevcut .claude/ tarama:**
   - `.claude/skills/*.md` listesi → hangi skill'ler zaten var, sonuncu commit ne zaman
   - `.claude/agents/*.md` listesi → ajan-skill duplikasyonu var mı

2. **Proje pattern tespiti:**
   - Son 30 commit (`git log --oneline -30`) tara → tekrarlayan iş var mı? ("intel scan", "weekly report", "deploy", "review")
   - `CLAUDE.md`'deki doctrine'a karşı: hangi disiplin değerlendirilmiyor (verification skill yok mu? lessons-learned skill yok mu?)
   - `knowledge/wiki/` doluysa: knowledge update / sentez skill'i lazım olabilir

3. **Önerme — formatı:**

   ```markdown
   ## Mevcut skill'lerin
   - <existing.md>: <bir cümle değer>

   ## Faydalı OLABİLECEK ama henüz pattern oturmamış
   - <name>: <ne yapardı> — <hangi pattern'i izliyor> — şimdi yapma, X kez daha pattern gözle

   ## Önereceğim 1-2 skill (yapılması gerçekten değerli)
   - <name>: <description> — <hangi friction'u çözüyor> — kanıt: <commit/observation>

   ## Sileyim diyebileceğin
   - <name>: 3 ay kullanılmadı / iki başka skill'in alt-seti / pattern artık geçerli değil
   ```

4. **Sopa tut, havuç tut:** Ham "yap yap yap" listesi DEĞİL. %30 önerin "yapma henüz" / "varolanı geliştir" olsun. Cursor "fewer + better" doctrine'i: 5-10 skill, daha fazlası bloat.

# ASSESS mode — bir spesifik skill için karar

## Step 1 — Inner-loop test (gate)

Before writing anything, ask the user:

1. **"Bu işi günde kaç kez yapıyorsun?"** — 2-3x/gün ise geçer.
2. **"Hep aynı pattern mi tekrarlıyor, yoksa her seferinde farklı mı?"** — aynı pattern ise geçer.
3. **"Preloaded context (önceden hazır talimat + örnek) yardım eder mi?"** — evet ise geçer.

Eğer 3'üne de "evet" değilse, kibarca DURDUR:

> "Bu iş henüz skill olmaya hazır değil. Önce 2-3 kez normal şekilde yap; pattern oturduğunda + her seferinde aynı şeyi yazdığını farkettiğinde geri dönelim. Pre-build skill = bloat."

3'üne de "evet" ise devam.

## Step 1.5 — Overlap kontrolü

`.claude/skills/*.md` tara. Aynı işi yapan skill var mı? Benzer pattern bir skill'in alt-seti mi?
- Varsa: "Bu yeni skill yazmak yerine `<existing.md>` skill'ini geliştirelim. Şu satırı ekle: ..."
- Yoksa: CREATE mode'a geç.

## Step 2 — Type'ı belirle

Sor: **"Bu skill ne yapıyor?"**

- **Foundational** — sistemi iyileştirir (örn. session sonu lessons-learned'u wiki'ye yaz, audit yap). Tetikleyicisi: yeni iş başında ya da iş sonunda.
- **Execution** — somut iş yapar (örn. weekly-report üret, intel scan başlat). Tetikleyicisi: kullanıcı slash command çağırınca.

## Step 3 — Field'ları topla

Tek tek sor:

1. **`name`** (slash command adı, kebab-case) — örn: `weekly-report`, `audit-doctrine`.
2. **`description`** (Claude proactive trigger'ı bundan okur) — **çok önemli**. Şu pattern'i izle:
   - "Use when X happens" / "Use at start of Y" / "Use after Z"
   - Specific olsun — "Use when working with files" çok geniş, çalışmaz. "Use after completing a non-trivial feature, to capture lessons-learned in `knowledge/wiki/`" iyi.
3. **Body** — Claude'un ne yapacağı. Adım adım. Hangi dosyayı okuyacak, hangi tool'ları kullanacak, çıktı formatı ne.

## Step 4 — Inner-loop test'i body'e enjekte et (foundational için)

Eğer foundational ise body'nin başına şunu ekle:

```
Bu skill <açıklama>. Çalışmadan önce gerçekten gerekli mi kontrol et —
<koşul>. Değilse: "Şu an gerek yok, X yap" diye yönlendir.
```

## Step 5 — Yaz

Dosya: `.claude/skills/<name>.md`. Format:

```markdown
---
name: <name>
description: <description>
---

<body>
```

**Body uzunluk eşiği: ~150 satır.** Daha fazlasıysa Anthropic 3-level progressive disclosure pattern'i uygula — alt-konuları `<name>/SKILL.md` + `<name>/<subtopic>.md` formatına böl, SKILL.md'den name ile referans ver. Body lean kalır, Claude alt-dosyayı sadece gerektiğinde okur.

**Bundled scripts (deterministic execution):** Skill klasörü altına Python/bash script koy, body'den path ile referans ver. Claude script'i Bash tool ile çalıştırır — token üretmek yerine deterministic sonuç alır (örn. PDF parse, CSV transform, hash, sort). LLM'in pahalı çözeceği aritmetik/parse iş için ideal.

Yazdıktan sonra:
1. Kullanıcıya path'i göster.
2. Test öner: "Yeni session aç ya da bu session'da `/<name>` çağır — tetiklenmesini doğrula."
3. Hatırlat: skill description'ı belirsizse Claude proactive tetikleyemez. 1 hafta kullanıp description'ı keskinleştirmeye geri dön.

## Step 6 — Description tuning (1 hafta sonra)

Skill 1 hafta kullanılıp description hâlâ yanlış tetikliyorsa (false negative: çağrılması gerektiğinde gelmiyor / false positive: alakasız sorularda tetikleniyor), eval-driven rewrite:

**Hafif yol (layermark vendor):** `python template/scripts/skill_tuner/improve_description.py` — minimal eval results JSON ver, Anthropic'in description-rewrite prompt'unu `claude -p` ile çağırır, tuned description döner. Vendor edilen tek script; eval pipeline yok. Detay: `template/scripts/skill_tuner/README.md`.

**Tam lifecycle (Anthropic resmi plugin):** Production-critical skill için (KVKK pack gibi) Anthropic'in `skill-creator` plugin'ini chain et — eval pipeline (20 trigger + 20 non-trigger query), grader subagent, HTML viewer, packager dahil. Kurulum: `gh extension install anthropics/claude-plugins` + `/skill-creator` (Anthropic). **NOT:** Anthropic plugin folder format bekler (`<name>/SKILL.md`); layermark single-file format'tan dönüşüm için bir kerelik: `.claude/skills/<name>.md` → `.claude/skills/<name>/SKILL.md` + scripts klasörü ekle. Geri dönüşü güç değil, ama overlap kontrolünden geçirip karar ver.

**Ne zaman tuning gerekmez:** Skill 2 hafta sorunsuz çalıştıysa, lightweight (script yok, body <50 satır), description'da spesifik trigger kelimeleri zaten var. Premature optimization = skill-creator anti-pattern'i.

# Hard rules

- **Inner-loop test'siz skill yazma.** Friction yaşanmadan skill = ölü kod.
- **Untrusted skill = audit mecburi.** Başkasının yazdığı skill'i kopyalıyorsan: (1) SKILL.md'yi tamamen oku, (2) bundled script/dependency listesini gör, (3) external network call var mı bak. Skill içindeki kod Claude'a tool olarak verilir — `rm -rf` veya data exfiltration gizli olabilir. Trusted source dışı skill'i blind kopyalama. Layermark `import_skill.py` zaten frontmatter validate eder ama içeriği sen okuyacaksın.
- **Body'de iş mantığı yazma** ki kullanıcı pattern'i değişirse skill obsolete olmasın. Body talimat olsun, kod değil.
- **Yes-bot olma.** "Skill yaz bana" diyene önce inner-loop test uygula. %30 vakada hayır de.
- **Overlap kontrolü zorunlu.** Mevcut skill'lerin üstüne yenisini yazma — varolanı geliştir.
- **Skip framework wrappers.** "pytest çalıştır" skill değil — bash command. Skill ancak shaped-context + judgment gerektirirse anlamlı.
- **ADVISE modunda %30 "hayır" / "yapma henüz" verisi olsun.** Cursor "fewer + better" doctrine — 5-10 skill, fazlası bloat.
- **Model-aware skill text.** Claude Opus uppercase'i emphasis olarak alır; GPT-5.x uppercase'de overcautious'a geçer + fazla clarifying question sorar (Arnaldi AI Engineer Europe 2026-05, single-source medium-confidence). Multi-model targetlı skill paketleri için IMPORTANT/MUST/NEVER bloklarını sadel deklaratif tona çevir. Claude-only ise mevcut ton OK.
- **3-layer skill anatomy — tools > prompt.** Skill = description (when-to-use) + instructions (playbook) + **tools (scripts/APIs)**. Çoğu kullanıcı playbook'a obsesli, tools layer'ı atlıyor. Anthropic engineer Eric (AI Code Summit 2026-05): *"the tools they make to give the model are sort of these incredibly bare-bones... an engineer wouldn't be able to work with this."* Leverage tools layer'ında — Step 5 "Bundled scripts" pattern'i operationalize ediyor. Kaynak: Austin Marchese 2026-05-17 distillation.
- **Post-session compound (skills smarter every session).** Skill her invoke sonrası sor: *"Bu fix one-time mi, yoksa skill'in içinde kalıcı mı olmalı?"* Forever ise — skill'i güncelle (rule, example, edge case ekle). Anthropic engineer quote: *"Claude on day 30 is going to be a lot better than Claude on day 1."* Bu compound loop skill'in değerinin yarısı; atlanırsa skill'ler dondurulmuş kalır.
- **Frontmatter flags (Anthropic v2025+ feature).** Agent-only skills için `user_invocable: false` (slash menüden gizler — kullanıcı doğrudan çağırmaz, sadece başka agent çağırır). User-only risky skills için `disable_model_invocation: true` (model autonom çağıramaz; user explicit invoke etmeli). Concrete kullanım: deploy/send/credential-rotate gibi geri alınamaz aksiyonlar `disable_model_invocation: true`. Default ikisi de unset.

# Anti-patterns

- ❌ Generic "code-reviewer" skill (Claude built-in zaten yapar)
- ❌ "format my code" (lint/prettier işi)
- ❌ "açıkla bu fonksiyonu" (chat'te zaten yapılıyor)
- ❌ Frontmatter eksik / description belirsiz
- ❌ Body'de specific dosya path'i hardcode (proje taşınınca kırılır)
