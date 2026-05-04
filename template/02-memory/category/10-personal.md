# Kategori: Kişisel & verimlilik

## Tipik kullanım
Personal asistan, GTD (Getting Things Done), journal, habit tracker, kişisel CRM, memory aid, life dashboard.

## Risk profili
**Low** dış zarar, **HIGH privacy**. Kişisel veri (mesaj, takvim, mali, sağlık) gerçek hayat zedeleyebilir leak olursa.

## Doctrine emphasis
1. **Minimum permissions (D7)** — kişisel data agent'larında scope sıkı: read-only default, write için açık onay
2. **Privacy** — kişisel veri 3rd-party LLM'e leak etme; local-first tercih
3. **Hooks > prompts (D11)** — *"asla X dosyasını oku"* gibi kuralar deterministic hook
4. **Memento (D3)** — long-term personal context için fresh window discipline (sürekli compact = sediment)
5. **Rules emerge (D9)** — kişisel pattern'ler organik birikir

## 7 spesifik pattern

### 1. Local-first design
Veri local file system'da. Cloud sync (Dropbox/iCloud) OK ama 3rd-party AI service'e direkt veri akışı yok.

### 2. Read-only by default
Calendar, email, file system erişimi default read-only. Write için her seferinde explicit izin (`agent-approval`).

### 3. Sanitization layer
Sensitive field'lar (email, phone, address, SSN-equivalent) prompt'a girmeden mask: `[redacted-email]`, `[phone-XXXX-1234]`.

### 4. Privacy budget
Aylık "ne kadar kişisel data 3rd-party LLM'e gitti" ölç. Trend artıyorsa local model (Llama, Mistral) consider.

### 5. Context isolation per topic
Sağlık + finansal + kişilik = ayrı context window. Birinin pollution'ı diğerine geçmesin.

### 6. Backup discipline
Local data = sen + ben backup. Cloud sync + external HDD + encrypted weekly. Loss = unrecoverable.

### 7. Periodic privacy audit
Aylık: hangi service'e ne data gönderdim? Audit log + cleanup. *"Sandık" pattern'i — neyi nerede tuttuğunu unutmamak.

## Önerilen skill'ler
- `agent-approval` — kişisel data değiştiren her aksiyon
- `verify-agent-output` — agent claim doğrulama
- `suspend` + `resume` — uzun kişisel projeler için
- `ne-yapayim` — stuck'ken 4-option menü
- `project-advisor` — aylık kişisel audit ("hâlâ kullanıyor muyum?")

## Sample first-task prompt
> *"İlk feature: günlük calendar + email summary, sabah 8'de Telegram'a düşsün. Read-only Calendar API, read-only Gmail API. Summary draft `data/summary/<date>.md`'ye yazılır, sonra Telegram'a gider. Hassas data (email body full text) prompt'a girmez — yalnız subject + sender. Send öncesi ilk hafta `--dry-run`."*

## Anti-patterns
- ❌ Kişisel veriyi cloud LLM'e direkt feed — privacy budget patlar
- ❌ Write permission default — accident kategorisi açık
- ❌ Tek context'te her şey — sağlık verisi finansal context'te leak
- ❌ Backup yok — yıllar emek tek crash'te gidebilir

## Bu kategori için zorunlu doctrine docs
(Yok — Low external risk; ama privacy ile related olarak `02-memory/doctrine/auto-mode-classifier.md` opt-in faydalı)
