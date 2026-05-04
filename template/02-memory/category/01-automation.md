# Kategori: Otomasyon & workflow

> Wizard'da bu kategoriyi seçtiysen bu doc otomatik kopyalanır. Diğer kategori dosyalarını sil veya `_archive/`'a taşı.

## Tipik kullanım
Mesaj cevap (WhatsApp/email), takvim/mail otomatizasyon, schedule, scrape, periyodik rapor pipeline, monitoring + alert.

## Risk profili
**Medium.** Çoğu otomasyon yan-etkili (mesaj gönderiyor, hesabı işliyor) ama tek-kullanıcı / tek-domain kalıyor. Yine de ödeme veya silme gibi action varsa Phase 0.7 risk değerlendirmesini "production"a çek.

## Doctrine emphasis (20 doctrine'den hangisi öne çıkar)
1. **Verification (D6)** — agent "mesaj gönderildi" derse bağımsız doğrulama (`verify-agent-output` skill'i operationalize eder)
2. **Hooks > prompts (D11)** — *"asla dış API'ye yazma"* gibi hard rule'lar pre-tool-use hook ile (CLAUDE.md değil)
3. **Minimum permissions (D7)** — agent yalnız ihtiyaç duyduğu API key/scope'u alır
4. **Anti-hallucination (D13)** — *"WhatsApp API'si nasıl çalışıyor"* gibi sorularda **search tool zorunlu**
5. **Rules emerge (D9)** — başlangıçta minimal CLAUDE.md, off-rails giderse kural ekle

## 7 spesifik pattern

### 1. Idempotency hardcoded
Aynı mesajı 2 kez gönderme: queue-side `last_event_id` tracking + retry-on-error. Agent her seferinde state file'a yazar, restart'ta resume eder.

### 2. Rate-limit + circuit breaker
3rd-party API'ler (WhatsApp, OpenAI, Twilio) rate-limit verir. Per-API circuit breaker (`02-memory/orchestrator-safety.md` doctrine) — N error içinde X süre cooldown, half-open test sonrası açılır.

### 3. Dry-run mod default
Yeni script ilk çalışması: log + email *taslak* yaz, **gönderme**. User onayladıktan sonra `--send` flag.

### 4. Failure escalation chain
3 retry fail → `data/inbox/escalated/<timestamp>.json` yaz + opsiyonel notify (kişisel Telegram/email). Sessiz fail = bug-magnet.

### 5. Schedule witness
Cron / Task Scheduler'la çalışan script: her run kendi run-id'siyle `data/runs/<date>.jsonl`'ye row yazar (start/end/status). Kayıp run = system event (paneller bunu yakalar).

### 6. Secrets audit her ay
`.env` + `.secrets/` periyodik audit: hangi token nerede, hangi servis, son rotation ne zaman. Yıllık rotation policy.

### 7. Reversibility her aksiyon için
*"Bu mesaj yanlışsa nasıl geri alırım?"* her tool için cevaplı olmalı. Compensate path tanımlı (Saga pattern).

## Önerilen skill'ler (14'ten subset)
- `agent-approval` — yan-etkili her aksiyonda gate
- `verify-agent-output` — agent claim'lerini doğrula
- `yardim` — hata mesajı yapıştır → fix
- `suspend` + `resume` — Memento, uzun debugging session'ları için
- `project-advisor` — aylık audit (bu otomasyon hâlâ ihtiyaca uygun mu?)

## Sample first-task prompt
> *"İlk feature: WhatsApp Cloud API ile gelen müşteri mesajlarına otomatik cevap. Önce dry-run mod (cevabı log'a yaz, gönderme), 5 örnek elle kontrol et, sonra `--send` ile aç."*

## Anti-patterns
- ❌ Cron'a doğrudan `python main.py` koymak — log yok, error handling yok
- ❌ "Şimdilik test, sonra prod'a alırım" — config flag yok, riskli
- ❌ Bir hata 1 kez gördüğünde yapısal değişiklik (doctrine emerge sadece tekrarda)

## Bu kategori için zorunlu doctrine docs (varsa)
- `02-memory/doctrine/auto-mode-classifier.md` — yan-etkili action allow-list
- `02-memory/doctrine/red-team-primitive.md` — bot abuse senaryoları
