# Skills

Skills = senin ya da Claude'un tekrar tekrar yaptığı işin tek adımlık `.md` versiyonu. Slash command olarak çağrılır.

## Inner-loop test

Bir iş skill olmaya hak kazanır mı:

1. **2-3x/gün** mü yapıyorsun?
2. Hep **aynı pattern** mı?
3. **Preloaded context** yardım eder mi?

Üçüne **evet** dersen `.md` ile yaz. Aksi halde yapma — pre-build skill = bloat.

**4 istisna pre-shipped** — hepsi inner-loop test'i day-one'da geçer (foundational meta-skills):

- **`grill-me.md`** — non-trivial iş başında shared-understanding interview (Pocock pattern).
- **`skill-creator.md`** — yeni skill yaratırken VEYA "ne skill yapsam?" diye sorduğunda. ASSESS / ADVISE / CREATE 3 modu var. %30 "yapma" der.
- **`agent-creator.md`** — yeni subagent yaratırken VEYA "ne ajan lazım?" diye sorduğunda. Aynı 3 mod.
- **`project-advisor.md`** — aylık (veya ne zaman istersen) proje audit'i. Stale skill'leri yakalar, missing pattern'leri surface'lar, doctrine drift uyarır.

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

## Nasıl ekle

1. Friction yaşa — bir işi 3. kez yaparken farket
2. `/skill-creator` çalıştır — interview ile yarat (inner-loop test'i otomatik uygular)
3. Veya manuel: `.claude/skills/<name>.md` yaz, frontmatter + body
4. Bir sonraki session otomatik tetiklenir
