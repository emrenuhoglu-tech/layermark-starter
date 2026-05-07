# Skills

Skills = senin ya da Claude'un tekrar tekrar yaptığı işin tek adımlık `.md` versiyonu. Slash command olarak çağrılır.

## 🧭 Hangisini ne zaman? — decision tree

15 skill var, alfabe değil **kategori** sırasına göre:

### 🌱 İlk 10 dakika (yeni proje)
- **`grill-me`** — non-trivial bir iş başında. "Bu özelliği nasıl yapalım?" soru sırası.
- **`ne-yapayim`** — boş ekrana bakıyorsun, ne yapacağını bilmiyorsun. 4 seçenek menüsü.

### 🔨 Yeni feature / yeni kod
- **`grill-me`** → spec netleştir
- **`failing-test-as-prompt`** → testi önce yaz, sonra implement et
- **`ubiquitous-language`** → domain terimlerini sabitle, isim çakışması ve drift'i önle

### 🛡️ Riskli action (silme, ödeme, dış mesaj)
- **`agent-approval`** — hard gate, agent kullanıcıya intent + blast radius söyler, onay bekler
- **`verify-agent-output`** — agent "tamamlandı" dediği zaman bağımsız doğrulama (farklı path) — **tek-seferlik manuel** kontrol
- **`verifier-agent`** — parallel verifier scaffold (Stop hook + atomic claims report). Multi-agent veya HIGH-RISK kategori için **otomatik sürekli** kontrol (IndyDevDan 2026-05 pattern)

### 🚧 Stuck / kayboldun
- **`yardim`** — hata mesajı yapıştır, plain-TR/EN açıklama + fix adımları
- **`suspend`** → checkpoint yaz, fresh window'da `resume` ile devam (Memento)
- **`resume`** — yeni session başında en son suspend'ı yükle, kaldığın yeri kavra

### 🧹 Aylık / temizlik
- **`project-advisor`** — proje audit. Stale skill, missing pattern, doctrine drift uyarısı
- **`spagetti-check`** — code-smell tier-1: file size 350+, nesting 4+, duplication, dead code
- **`sync-drift`** — folder reality vs README/CLAUDE.md fark tespit (multi-workstream projelerde)

### 🛠️ Skill / agent yaratma
- **`skill-creator`** — yeni skill önerirken (ASSESS/ADVISE/CREATE 3 mod). %30 "yapma" der.
- **`agent-creator`** — yeni subagent yaratırken. Aynı 3 mod.

## Inner-loop test

Bir iş skill olmaya hak kazanır mı:

1. **2-3x/gün** mü yapıyorsun?
2. Hep **aynı pattern** mı?
3. **Preloaded context** yardım eder mi?

Üçüne **evet** dersen `.md` ile yaz. Aksi halde yapma — pre-build skill = bloat.

**15 foundational pre-shipped** — 10 inner-loop meta-skill + 5 kategori-driven safety skill:

### 10 inner-loop meta-skill (day-one inner-loop test'i geçer)

- **`grill-me.md`** — non-trivial iş başında shared-understanding interview (Pocock pattern).
- **`skill-creator.md`** — yeni skill yaratırken VEYA "ne skill yapsam?" diye sorduğunda. ASSESS / ADVISE / CREATE 3 modu var. %30 "yapma" der.
- **`agent-creator.md`** — yeni subagent yaratırken VEYA "ne ajan lazım?" diye sorduğunda. Aynı 3 mod.
- **`project-advisor.md`** — aylık (veya ne zaman istersen) proje audit'i. Stale skill'leri yakalar, missing pattern'leri surface'lar, doctrine drift uyarır.
- **`yardim.md`** — plain-TR/EN troubleshooting (hata yapıştır → çevir + fix adımları).
- **`suspend.md`** — session sonu Memento doc'u. Compact'a alternatif. Sıradaki SOMUT adım + RESUME PROMPT bloğu üretir.
- **`resume.md`** — yeni session başlangıcında en son suspend'ı yükler, 1-satır recap, onay sonrası başlar.
- **`sync-drift.md`** — multi-topic / multi-workstream projelerde haftalık drift audit. Folder reality vs README/CLAUDE.md fark tespit. (a) projelerde no-op.
- **`ne-yapayim.md`** — "ne yapsam?" / stuck olduğunda 4 seçenek (audit/brainstorm/skill öner/resume). Initiative WITH user control — tek menü, kullanıcı seçer. Idle-prompt anti-pattern'inden kaçınır.
- **`spagetti-check.md`** — code-smell tier-1 sanity check (file size 350+ soft cap, deep nesting 4+, duplication, dead code). Edit yapmaz, BLOCKER/MAJOR/MINOR flag + fix prompt verir. Pocock failing-test-as-prompt pattern.

### 5 kategori-driven safety skill (HIGH-RISK kategoriler + production zinciri için zorunlu)

Bu skill'ler inner-loop test'i kullanıcı-tarafında değil, **kategori-tarafında** geçer: finans, hukuk, multi-agent, otonom action içeren projeler ilk gün'den bunları kullanır.

- **`agent-approval.md`** — hard gate. Agent destructive/irreversible action öncesi kullanıcıya intent + blast radius söyler, onay bekler. HIGH-RISK kategorilerde her finansal/legal action'da otomatik tetiklenir.
- **`verify-agent-output.md`** — agent "tamamlandı" dediği zaman bağımsız verification (farklı path / source-of-truth karşılaştırma). **Tek-seferlik manuel** çağrı.
- **`verifier-agent.md`** — parallel verifier **scaffold**. Stop hook + atomic claims report + auto re-prompt + self-improvement loop. IndyDevDan 2026-05 pattern, Cursor + Sam Witteveen + Anthropic Engineering convergence. Multi-agent (Phase 0.5 = `b`) veya HIGH-RISK kategori → essentially mandatory.
- **`ubiquitous-language.md`** — domain glossary. "Müşteri" mi "kullanıcı" mı, "MRR" mi "revenue" mu — terimleri sabitle, drift'i önle. Multi-developer / multi-session projelerde kritik.
- **`failing-test-as-prompt.md`** — testi önce yaz, sonra implement et. Pocock pattern. Finansal invariant ("balance her zaman = 0") ve compliance kontrolünde özellikle değerli.

Diğer skill'lerin organik gelmesini bekle (inner-loop test). Şüphedeyken `/skill-creator` ya da `/project-advisor` çağır — danışmanlık verir.

## İki tip

- **Foundational** — sistemi iyileştirir (örn. session sonu lessons-learned'u `knowledge/wiki/`'ye yaz)
- **Execution** — iş yapar (örn. `/weekly-report` haftalık rapor üretir)

## Format

```yaml
---
name: my-skill
description: When to invoke (be specific — Claude triggers proactively from this).
---

Body — Claude'un ne yapacağı, hangi dosyaları okuyacağı, çıktı formatı.
```

### Dynamic shell context (`!\`...\``)

Skill body'sinde shell çıktısını runtime'da inject etmek için ünlem + backtick syntax'ı kullanılır:

```markdown
!`git diff main...HEAD`
!`gh issue view 42 --json body,labels`
```

Skill resolve edildiğinde komut çalışır, çıktı prompt'a gömülür. Static template + dinamik context için ideal — git state, issue body, dosya snapshot vs. Matt Pocock (Sand Castle) bu pattern'i Claude skills feature'ından adapte etti.

### Bundled scripts (deterministic execution)

Skill klasörü altına Python/bash script koy, SKILL.md body'sinden path ile referans ver. Claude script'i Bash tool ile çalıştırır — token üretmek yerine **deterministic sonuç** alır (örn. PDF parse, CSV transform, hash, sort, aritmetik). LLM'in pahalı/güvenilmez çözeceği iş için ideal. Anthropic Agent Skills doctrine 2026-05: bu skill'in 3. progressive disclosure katmanı (1: metadata, 2: SKILL.md body, 3: bundled files).

```text
.claude/skills/my-skill/
├── SKILL.md           # body referans verir
├── scripts/
│   └── extract.py     # Claude `python scripts/extract.py <pdf>` ile çağırır
└── data/
    └── reference.json # script okur
```

## Nasıl ekle

1. Friction yaşa — bir işi 3. kez yaparken farket
2. `/skill-creator` çalıştır — interview ile yarat (inner-loop test'i otomatik uygular)
3. Veya manuel: `.claude/skills/<name>.md` yaz, frontmatter + body
4. Bir sonraki session otomatik tetiklenir
