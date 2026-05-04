# Kategori: Hukuk & uyumluluk

> **🚨 HIGH RISK kategorisi.** Bu doc seçildiyse setup_starter.py otomatik şu doctrine docs'larını kopyalar:
> - `02-memory/doctrine/auto-mode-classifier.md` (zorunlu)
> - `02-memory/doctrine/red-team-primitive.md` (zorunlu)
> - `02-memory/doctrine/multi-grader-eval.md` (zorunlu)
>
> `agent-approval` skill'i her hukuki action'da otomatik. Phase 0.7 risk = (3) production default.
>
> **⚖ Ek uyarı:** AI generated legal output **legal advice değildir**. Ücretli lawyer review zorunlu.

## Tipik kullanım
Sözleşme review, regülasyon check, compliance documentation, contract draft, due diligence, RFP/RFI hazırlık, policy yazma, GDPR/KVKK audit.

## Risk profili
**HIGH.** Hukuki hata:
- Sözleşme açığı = milyon-dolar disputes
- Regülasyon ihlali = ceza + kapanma
- Yanlış legal opinion = malpractice claim
- Privacy breach = fines + brand zedeler

Plus: **AI hallucinated case law / statute** = court'ta dezavantaj (ABD'de gerçek vakalar mevcut, lawyer disbar olabilir).

## Doctrine emphasis
1. **Anti-hallucination (D13)** — case law, statute, precedent için **search tool ZORUNLU + citation discipline**. Hallucinated citation = malpractice.
2. **Verification (D6)** — her legal claim için bağımsız source check (`verify-agent-output`)
3. **Auto-mode classifier (D16)** — block list: "send", "submit", "file" — legal document'lar otomatik gönderilmez
4. **Red-team primitive (D20)** — adversarial: opponent counsel'in açıkları nasıl bulur
5. **Concise + unresolved (D12)** — ambiguity flag, "muhtemelen" ifadelerinde extra disclaimer

## 9 spesifik pattern (HIGH RISK)

### 1. Citation discipline (zorunlu)
Her legal claim için: tam citation (jurisdiction, statute/case, year, paragraph). Format örneği:

> "TBK m. 49" veya "16 USC § 1538(a)(1)(B)"

Citation yoksa claim yapma. Agent "I think generally the law is..." kullanma.

### 2. Disclaimer wrapper
Her output başında ve sonunda:

> "Bu metin AI tarafından üretildi, **legal advice değildir**. Bağlayıcı görüş için licensed attorney consultation gerekir. Jurisdiction: [X]. Tarih: [Y]."

### 3. No auto-action
Hukuki document'lar **asla otomatik gönderilmez** (email, fax, court filing). Her output draft, human attorney sign-off sonrası gider.

### 4. Source-of-truth: official only
Statute/regulation için: resmi gov source (mevzuat.gov.tr, eur-lex.europa.eu). Wikipedia + secondary commentary güvenilmez.

### 5. Jurisdiction explicit
Her case için jurisdiction baş tarafta belirtilir. "TR" "US-CA" "EU" gibi. Cross-jurisdiction claim ekstra dikkat.

### 6. Time-stamping
Yasa zaman içinde değişir. Output'ta "Bu analiz [tarih] itibariyle geçerli mevzuat üzerine. Sonradan değişiklik kontrol et."

### 7. Privilege awareness
Attorney-client privilege material = confidential. Agent prompt'a koymadan önce sanitize. Asla 3rd-party LLM'e leak etme.

### 8. Adversarial red-team
Sözleşme draft'ı için: opponent counsel'in açıkları nasıl exploit eder? Claude'a "play opponent" rolü ver, weakness'leri bul.

### 9. Audit trail her review için
Kim review etti, ne zaman, hangi changes. Compliance için audit-grade trail.

## Önerilen skill'ler
- `agent-approval` — **zorunlu**, hukuki document gönderme öncesi
- `verify-agent-output` — **zorunlu**, her citation için bağımsız check
- `grill-me` — yeni legal task spec öncesi (jurisdiction, parties, goal)
- `ubiquitous-language` — legal terminology (party, indemnify, force majeure, vs.)
- `project-advisor` — aylık compliance audit (mevzuat değişti mi?)

## Sample first-task prompt
> *"İlk task: '[contract type]' draft, jurisdiction TR, parties [X] ve [Y]. Önce TBK + ilgili özel mevzuat'tan applicable madde'leri **search tool ile** çıkar (citation full). Draft `drafts/contract-001.md`, her madde altında source link. Output disclaimer wrapper'lı. **Asla send/submit etme** — attorney review öncesi gönderim yok."*

## Anti-patterns (HIGH RISK)
- ❌ "AI legal advice verir" — explicit disclaimer + lawyer review olmadan output kullanma
- ❌ Hallucinated case citation — court'ta sanction
- ❌ Generic "general principles" claims — jurisdiction-specific olmadan worthless
- ❌ Privilege material 3rd-party LLM'e — confidentiality breach
- ❌ Auto-send legal document — approval gate yok = malpractice

## Compliance checklist
- [ ] KVKK / GDPR — privacy policy, data processing agreement
- [ ] AML/KYC — finansal sözleşme
- [ ] Sectoral regulation — sağlık, finans, eğitim sektörü-spesifik
- [ ] Bar association rules — eğer attorney kullanıyorsan, AI use disclosure

## Bu kategori için zorunlu doctrine docs
- `02-memory/doctrine/auto-mode-classifier.md` ✅
- `02-memory/doctrine/red-team-primitive.md` ✅
- `02-memory/doctrine/multi-grader-eval.md` ✅
- `02-memory/doctrine/brain-hands-decoupling.md` ✅
