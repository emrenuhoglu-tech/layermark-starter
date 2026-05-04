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
Her legal claim için: tam citation (jurisdiction, statute/case, year, paragraph). Jurisdiction'una göre format:

> - **TR:** *"TBK m. 49"*, *"6098 sayılı Kanun m. 112"*, *"Yargıtay 11. HD 2024/1234"*
> - **US:** *"16 USC § 1538(a)(1)(B)"*, *"Roe v. Wade, 410 U.S. 113 (1973)"*
> - **EU:** *"GDPR Art. 6(1)(a)"*, *"Case C-131/12 Google Spain"*
> - **UK:** *"s 12(3) Equality Act 2010"*, *"Donoghue v Stevenson [1932] AC 562"*

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

## Sample first-task prompt (kendine göre uyarla)
> *"İlk task: '[contract type, örn: NDA / SaaS subscription / employment]' draft. **Jurisdiction: [TR / US-CA / EU / UK / vb.]**. Parties: [X] ve [Y]. Önce ilgili statute + precedent'i **search tool ile** çıkar — sadece resmi gov source'undan (mevzuat.gov.tr / law.cornell.edu / eur-lex.europa.eu / legislation.gov.uk). Citation full (yukarıdaki Pattern 1 formatı). Draft `drafts/contract-001.md`, her madde altında source link. Output disclaimer wrapper'lı. **Asla send/submit etme** — attorney review öncesi gönderim yok."*

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

## 7-item production deployment checklist (Sam Witteveen 2026-05)

Hukuk agent'i client-facing production'a giriyorsa bu 7 madde zorunlu. Solo lawyer kullanıyorsa bile (1), (4), (7) opt-out edilmemeli — bar association liability + client confidentiality breach riski.

| # | Item | Niye | Hukuk-spesifik implementasyon |
|---|------|------|-------------------------------|
| 1 | **Model control (gateway)** | Privileged information leak — provider deprecation kontrol kaybı. | `packages/llm/gateway.py` — Anthropic primary (HIPAA / BAA arsivi), no-train flag zorunlu. Open model fallback (Llama / Mistral self-hosted) confidential matter için. |
| 2 | **Prompt registry (versioned)** | Lawyer drafting prompts = lawyer's IP + work product privilege. Code'a embed = privilege waiver riski. | `prompts/<jurisdiction>/<doctype>.md` git-tracked, encrypted-at-rest. Discovery sırasında "what prompted this output" sorulduğunda kanıt zinciri var. |
| 3 | **Guardrails (pre/post LLM)** | KVKK / GDPR PII redaction zorunlu; client name + case ID obfuscation; toxic / unauthorized practice of law (UPL) check. | Pre-LLM: client name → `[CLIENT-A]` placeholder. Post-LLM: "this is legal advice" → soft-disclaimer required. Bar association banned phrases ("guaranteed outcome", "no risk") block list. |
| 4 | **Budget cap (per-matter + per-day)** | Billing client per-matter; runaway loop = wrong-matter charge + ethical fee complaint. | `apps/<service>/budget.py` per-matter daily token cap; aşılırsa stop + email. Audit trail her token kullanımı bir matter ID ile bağlı. |
| 5 | **Tool/MCP control (central auth)** | Case management API + e-discovery tool + court filing API: leaked auth = privileged communication breach. | `packages/tools/auth.py` — tek noktada secret store. Per-matter access scope (avukat A matter X'e bakar, matter Y'a bakamaz). |
| 6 | **Monitoring + tracing (OpenTelemetry)** | Malpractice claim sırasında "agent ne dedi, ne zaman, hangi kaynaktan" kanıtla. Per-matter trace zorunlu. | `loguru` → OTLP exporter; trace ID her draft + her citation + her advice output'a bağlı. Retention: matter close + statute of limitations (genelde 6+ yıl). |
| 7 | **Eval (pre + continuous post-prod)** | Model regression = yanlış citation = bar complaint. Yeni model gelince eski matter trace'lerini replay → drift catch. | `apps/eval/` — `tests/golden_traces/` 100+ jurisdiction-specific örnek; weekly cron replay; multi-grader rubric (Doctrine #18) %85 threshold. **Her output için 4-jurisdiction citation check (yukarıda Pattern 2)** otomatik eval'e bağlı. |

**Aksiyon önceliği** (HIGH-RISK kategori için ilk yapılacaklar): **(4) Budget cap (per-matter) → (6) Monitoring (matter-trace) → (3) Guardrails (UPL block + PII redaction) → (7) Eval replay**.

(Ref: AI Engineer 2026 — Sam Witteveen "Must Haves For Agents in Production". `02-memory/youtube-intel/2026-05-04-insights-batch2.md`'de detay.)
