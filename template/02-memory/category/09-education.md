# Kategori: Eğitim & araştırma

## Tipik kullanım
Online kurs hazırlama, akademik paper, tutorial, learning roadmap, presentation, knowledge base, study notes.

## Risk profili
**Low.** Eğitim materyali geri-alınabilir, edit, version. Hata maliyeti = öğrenenin yanlış öğrenmesi (geri-dönüştürülebilir).

Ancak **akademik integrity** ve **citation discipline** zorunlu — plagiarism + hallucinated citation reputational damage.

## Doctrine emphasis
1. **Anti-hallucination (D13)** — paper'da, kursta, tutorial'da iddialar için **search tool + citation zorunlu**
2. **Concise + unresolved (D12)** — eğitim materyalinde ambiguity flag (öğrenci yanlış öğrenmesin)
3. **Surgical changes (D4)** — kurs müfredatını "iyileştirme" tuzağına düşme
4. **Verification (D6)** — her exercise için: nasıl doğrularız (test, expected output)
5. **Rules emerge (D9)** — pedagogical patterns kullanıma göre emerge eder

## 7 spesifik pattern

### 1. Progressive disclosure
Her concept önce simple version, sonra advanced. Başta exception cases yok. *"Quote, then qualify"*.

### 2. Citation discipline (akademik için)
Her claim → kaynak. Format: APA / MLA / Chicago — proje başında karar, tutarlı kullan.

**Knowledge base ile entegrasyon (Karpathy 3-layer pattern):**
- `knowledge/raw/<paper-id>.md` — paper'ın tam metni / PDF dump (immutable, source-of-truth)
- `knowledge/wiki/<topic>.md` — konuya sentez + her claim için `[[paper-id]]` cross-ref
- `02-memory/citations.md` — APA-formatlı master list (her unique citation tek satır)

Yeni paper workflow:
1. PDF text dump → `knowledge/raw/<author-year-slug>.md`
2. APA citation → `02-memory/citations.md`'a ekle
3. Sentez (`/grill-me` ile spec çıkar, sonra `knowledge/wiki/<topic>.md`'ye yaz, her claim için `[[<author-year>]]` cross-ref)
4. Aylık `/project-advisor` → orphan raw / stale wiki / missing citation audit

### 3. Learning objective per unit
Her bölüm/lesson için: "Bu bölümü bitirince öğrenci ___ yapabilecek". Measurable. Yoksa scope creep.

### 4. Worked example > generic explanation
Soyut açıklama yerine: 1 somut örnek, ad var, sayı var, çalışıyor. Sonra generalize.

### 5. Exercise = success verification
Her concept için exercise (input → expected output). Öğrenci kendini test edebilir, instructor manual grading'e ihtiyaç yok.

### 6. Glossary (kullanıcı + Claude'un birlikte)
Yeni terim → `02-memory/glossary.md`. `ubiquitous-language` skill operationalize eder. Tutarlı terminoloji = anlaşılırlık.

### 7. Iterative test → revise
1 öğrenciye dene → confused olduğu yer flag → revise. 5 öğrenci sonra patterns emerge.

## Önerilen skill'ler
- `grill-me` — yeni unit/lesson spec öncesi (learning objective net)
- `ubiquitous-language` — terminology consistency
- `failing-test-as-prompt` — exercise design (test-first)
- `verify-agent-output` — citation verification
- `project-advisor` — kurs sonu audit (öğrenci feedback nereye işaret ediyor?)

## Sample first-task prompt
> *"İlk unit: 'Python decorators'. Önce learning objective (ne öğrenecek?). Sonra 1 worked example (concrete, çalışan kod). Sonra 3 exercise (input → expected output). Her terminolojik terim `02-memory/glossary.md`'a ekle. Kaynak link her external claim için."*

## Anti-patterns
- ❌ Soyut başlamak — concrete example > abstract explanation
- ❌ Çok fazla concept tek lesson'da — progressive disclosure
- ❌ Hallucinated citation — academic integrity violation
- ❌ Exercise olmadan concept — learning verify edilemez

## Bu kategori için zorunlu doctrine docs
(Yok — Low risk)
