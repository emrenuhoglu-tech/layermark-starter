# Skills

Skills = senin ya da Claude'un tekrar tekrar yaptığı işin tek adımlık `.md` versiyonu. Slash command olarak çağrılır.

## Inner-loop test

Bir iş skill olmaya hak kazanır mı:

1. **2-3x/gün** mü yapıyorsun?
2. Hep **aynı pattern** mı?
3. **Preloaded context** yardım eder mi?

Üçüne **evet** dersen `.md` ile yaz. Aksi halde yapma — pre-build skill = bloat.

**Tek istisna:** `grill-me.md` template ile gelir. Her non-trivial iş başında çalıştırılır, frequency yüksek, pattern aynı, preloaded context yardım eder — inner-loop test'i day-one'da geçer. Diğer skill'lerin organik gelmesini bekle.

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

## Nasıl ekle

1. Friction yaşa — bir işi 3. kez yaparken farket
2. Claude'a sor: "Bu pattern için bir skill .md yaz, X frontmatter, Y body."
3. `.claude/skills/<name>.md` olarak kaydet
4. Bir sonraki session otomatik tetiklenir
