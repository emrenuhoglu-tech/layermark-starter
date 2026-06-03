---
name: code-review
description: Use when the user asks to "review", "check", "look over", or "audit" a diff/PR/recent change for surface-level issues. Scope is intentionally LIMITED — style nits, dead code, unused imports, format issues, micro-simplifications, obvious bugs in the touched lines. NOT architecture, design tradeoffs, ubiquitous-language naming, abstraction choice, or system-shape decisions — those belong to a human review with the user. Avoid the "compounding boos" anti-pattern (AI Engineer 2026-05-17): reviewing every agent's output with another agent layers low-signal noise. If the user wants design/architecture critique, redirect to `/grill-me` or a `prompt-engineer` AUDIT pass instead.
---

Bu skill diff/PR/son commit'leri **yüzey seviyesinde** geçer — insan'ın elle yapacağı banal düzeltmeleri yakalar, mimari kararlara dokunmaz.

# Scope (sıkı bağlayıcı)

## ✅ DO — bu skill bunlar için var

- **Naming nits**: variable/function/file isimleri convention'a uymuyorsa
  - Örnek: `const x = users.find(...)` → `const matchedUser`
- **Dead code**: değişikliklerin kullanılmaz bıraktığı import/variable/function
  - Örnek: import edip kullanmama, `let unused: string`
- **Format/style**: indent, trailing whitespace, açık-kapalı brace inconsistency
- **Micro-simplification**: 5 satırlık nested if → 1 satır guard
  - Örnek: `if (x) { if (y) { return z } }` → `if (!x || !y) return; return z`
- **Obvious bugs in touched lines**: `==` vs `===`, off-by-one, missing await, typo in literal
- **Comment hygiene**: orphan comment'ler, "TODO from 2 years ago", outdated docstring

## ❌ SKIP — bu skill bunlar için DEĞİL

- **Architecture/design tradeoffs**: "REST'ten GraphQL'e geçmeli misin?"
  - → `/grill-me` veya `prompt-engineer` AUDIT modu
- **Abstraction choice**: "bu entity'yi domain modeli olarak ayır"
  - → human review
- **Naming at the system level**: ubiquitous-language sözlüğü değişiklikleri
  - → `/ubiquitous-language` skill
- **Cross-file refactoring önerileri**: "bu pattern'i 8 yere yay"
  - → human + premortem
- **Approval flow / security model değişiklikleri**:
  - → `prompt-engineer` AUDIT (güvenlik pass'i her zaman çalışır)
- **Test coverage gaps for untouched lines**: skill sadece diff'i bakar, mevcut kod'un test'leri ayrı task

# Compounding boos guard (mandatory)

**Anti-pattern (AI Engineer Conf 2026-05-17, Mario):** Her ajan'ın çıktısını başka bir "review" ajan'ıyla geçirmek → "compounding boos" — düşük-sinyal noise birikir, gerçek bug'lar gürültüde kaybolur.

**Bu skill'in self-imposed sınırı:**
- Her review pass'i en fazla **5 finding** üretir. 6+ varsa: prioritize, ilk 5'i ver.
- Bir finding sadece DO listesindeki kategorilerde olabilir. SKIP kategorisindeyse: **drop**, "human review önerilir" notu ekle.
- Aynı dosyada çoklu nit varsa: tek finding altında topla, ayrı ayrı yazma.
- "Confidence: medium" altı finding'i hiç verme — kesin olmayan banal düzeltme = noise.

# Workflow

1. **Diff'i belirle**: kullanıcı PR/commit hash/file path verdiyse onu kullan. Vermezse: `git diff HEAD` ya da `git diff main`.
2. **Touched line'lara odaklan**: untouched code'a önerinin yeri DEĞİL. Diff dışı satıra dokunma.
3. **Per-finding format**:
   - `file:line` — pinpoint
   - `category` — DO listesinden (naming/dead-code/format/simplify/bug/comment)
   - `current` — bir satır
   - `suggested` — bir satır
   - `why` — bir cümle (yoksa: finding overstated, drop)
4. **Self-veto pass**: 5 finding'i de yaz, sonra her birinin SKIP kategorisine kaymadığını double-check. Şüpheliyse drop.
5. **Output**: max 5 finding + 1 satır summary. Liste boş çıkarsa: "Diff temiz, banal düzeltme yok." de — fabricate etme.

# Output template

```markdown
## Code review (n findings)

1. **{category}** — `{file}:{line}`
   - `{current}` → `{suggested}`
   - {why}

2. ...

---
**Skip notu (varsa)**: Architecture/design konuları gözlemledim ama bu skill scope dışı:
- {brief observation} → `/grill-me` veya human review öner.
```

# Anti-patterns

- ❌ "Bu fonksiyonu sınıf yap" — abstraction önerisi, scope dışı
- ❌ "Burada bir Strategy pattern olmalı" — design, scope dışı
- ❌ Diff dışı satırı eleştirmek — touched line'a odaklan
- ❌ 15 finding döküp "bunları düşün" demek — compounding boos
- ❌ "Confidence: low" finding üretmek — kesin değilse drop
- ❌ Aynı şeyi farklı dosyalarda 8 kez tekrarlamak — pattern level, human

# Cross-reference

- Mimari/design review için: `/grill-me`, `prompt-engineer` AUDIT
- Güvenlik review için: `prompt-engineer` AUDIT (security pass always-on)
- Spagetti detection için: `/spagetti-check`
- Verifier-style check için: `/verify-agent-output`
