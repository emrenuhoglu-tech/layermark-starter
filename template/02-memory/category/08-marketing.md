# Kategori: Pazarlama & satış

## Tipik kullanım
Copy yazma, campaign, lead gen, SEO, A/B test, email funnel, social ads, CRM workflow.

## Risk profili
**Medium.** Yanlış copy revize edilebilir; ama yanlış claim = false advertising regülasyon riski. Brand voice drift = uzun vadeli zarar.

## Doctrine emphasis
1. **Anti-hallucination (D13)** — *"Şu rakam, şu istatistik, şu testimonial"* claims için kaynak zorunlu
2. **Verification (D6)** — yayın öncesi human review (`verify-agent-output`)
3. **Surgical changes (D4)** — campaign'i "iyileştirme" tuzağına düşme; A/B variant ayrı
4. **Rules emerge (D9)** — winning patterns yakaladıkça brand glossary'ye ekle
5. **Concise + unresolved (D12)** — claim'lerde ambiguity flag

## 7 spesifik pattern

### 1. Brand voice document (zorunlu)
`02-memory/brand-voice.md` — 5-10 onaylı paragraf, 5-10 yasak phrase, ton-of-voice (casual/professional/technical), emoji policy. Yeni copy yazılırken Claude bunu load eder.

### 2. Claim verification gate
Her sayısal claim ("3x faster", "%80 müşteri", "leading platform") kaynak isteyecek. Source yoksa softer phrasing veya remove.

### 3. A/B test isolation
Variant A ve B = ayrı document. Tek dosyada karıştırma. Test sonucu ölçüldükten sonra winner main'e merge.

### 4. Channel-specific format
Email + LinkedIn + Twitter + landing page = farklı format. Substance aynı, format channel-spesifik. `02-memory/channel-formats.md`.

### 5. ICP (Ideal Customer Profile) document
`02-memory/icp.md` — kim alıyor, ne acı çekiyor, hangi dil onlara hitap ediyor. Copy bu profile karşı yazılır.

### 6. Compliance check (industry-spesifik)
Pharma, finance, legal, alcohol, gambling — claim'lerde regülasyon. *"Cure", "guarantee", "best"* gibi banned words.

### 7. Performance feedback loop
Yayınlanan campaign sonrası: open rate, click rate, conversion → `02-memory/campaigns/<date>.md` log. 5+ campaign sonra patterns emerge.

## Önerilen skill'ler
- `grill-me` — yeni campaign brief öncesi
- `ubiquitous-language` — brand voice + terminoloji
- `verify-agent-output` — claim verification
- `agent-approval` — yayın gate
- `project-advisor` — aylık campaign audit

## Sample first-task prompt
> *"İlk campaign: '[product] launch email'. Adımlar:*
>
> *1. **Önce iskelet:** `02-memory/brand-voice.md` ve `02-memory/icp.md` yoksa `/grill-me` çağır — birlikte 5-10 paragraf brand voice + ICP tek-sayfa profil çıkar (ton, yasak phrase, alıcı persona, acı noktası, dil tercihi).*
> *2. **Iskelet yazıldıysa load et**, sonra A/B subject variant: kısa vs benefit-driven. Body: max 200 word, tek CTA.*
> *3. **Her sayısal claim için source link** (`verify-agent-output` skill).*
> *4. **Yayın öncesi `agent-approval` gate** — yayın button'a basmadan önce 'gönder?' onayı."*

## Anti-patterns
- ❌ Generic AI copy — voice drift, herkes aynı sound
- ❌ "Faster, better, smarter" without source — false advertising
- ❌ A/B testte multiple variable change — sebep-sonuç çıkmaz
- ❌ Yayın sonrası performance feedback skip → öğrenme yok

## Bu kategori için zorunlu doctrine docs (varsa)
- `02-memory/doctrine/multi-grader-eval.md` — A/B test isolation + outcome verification için
