# Kategori: İçerik & medya üretimi

## Tipik kullanım
Blog, podcast, YouTube, newsletter, sosyal medya, dokümentasyon, marketing copy.

## Risk profili
**Low.** Yanlış içerik geri-alınabilir (edit), çoğu output draft + manuel review. Yayın momentinde error catch edilirse zarar minimal.

## Doctrine emphasis
1. **Anti-hallucination (D13)** — *"X aracı şunu yapıyor"* iddialarında **search tool + load context** zorunlu. Yanlış fact = brand zedeler.
2. **Surgical changes (D4)** — mevcut içeriği "iyileştirme" tuzağına düşme; sadece istenen değişiklik
3. **Verification (D6)** — yayın öncesi en az 1 round human review (`verify-agent-output` skill operationalize)
4. **Concise + unresolved (D12)** — output style: short, clear, ambiguity flag'le
5. **Rules emerge (D9)** — kişisel/marka voice patternin'i yakaladıkça CLAUDE.md'ye ekle

## 6 spesifik pattern

### 1. Voice samples file (zorunlu)
`02-memory/voice-samples.md` — markanın 5-10 örnek paragrafı. Yeni content yazılırken Claude bu file'ı load eder, ton karşılaştırır. Voice drift'in en güçlü antidotu.

### 2. Brand glossary
`02-memory/brand-glossary.md` — banned word list ("revolutionary", "synergy"...) + preferred phrasing + emoji policy. `ubiquitous-language` skill bu pattern'i operationalize eder.

### 3. Fact verification gate
İddia içeren her cümle (sayı, kişi adı, tarih, "X araştırma şunu söyledi") için kaynak link veya *[verify]* tag. Agent fact-check edilmeden yayına geçmez.

### 4. Draft → review → publish flow
Üç state: `drafts/` (free), `review/` (human-gate), `published/` (immutable). Agent yalnız drafts'a yazar.

### 5. Format separation
İçerik (substance) ve format (markdown/HTML/social) ayrı. Aynı içerik 3 kanala yayınlanırken format değişir, substance aynı kalır.

### 6. Series consistency
Multi-part content (kurs serisi, blog series) için `series-bible.md` — kararlar, terminoloji, story arc. Her yeni part önce bunu okur.

## Önerilen skill'ler
- `ubiquitous-language` — terminoloji + brand glossary
- `grill-me` — yeni piece başlangıcında brief netleştir
- `failing-test-as-prompt` — content "test"i = brand voice rubric (Claude as judge)
- `agent-approval` — *publish* action öncesi
- `project-advisor` — aylık content audit (drift, performans, gap)

## Sample first-task prompt
> *"İlk piece: '[konu]' hakkında 1500-kelimelik blog post. Önce `02-memory/voice-samples.md`'yi yükle, ton'u match et. Draft `drafts/` altında. Yayın öncesi fact-check: her sayı/iddia için kaynak link, kaynak yoksa `[verify]` tag."*

## Anti-patterns
- ❌ Voice samples olmadan content üretmek — ton drift garantili
- ❌ "AI yazsın, edit ederim" → çoğu zaman edit zorlu, baştan yazmak hızlı
- ❌ Single-source idea (yalnız LLM'e güven) → fact hallucination

## Bu kategori için zorunlu doctrine docs
(Yok — content category Low risk; production doctrine docs N/A)
