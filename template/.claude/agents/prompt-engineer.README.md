# prompt-engineer agent — README

**Plain-language guide.** Detaylı agent talimatı için → `prompt-engineer.md`.

---

## TR — Türkçe

### Bu nedir?

Projendeki "yardımcı asistan". Sen Claude Code'da günlük dille bir şey istediğinde, isteğini önce düzgün bir talimata çeviren + projeyi gerektiğinde denetleyen küçük bir asistan.

### Ne yapar?

1. **İsteğini düzenli prompt'a çevirir.**
   *Sen yazıyorsun:* "slack botu kur, channel'da yeni github issue gelince mesaj atsın"
   *Asistan üretiyor:* 30 satırlık paste-ready prompt — ne yapacağı, sınırları, doğrulama adımı, güvenlik kontrolü dahil. Sen onu kopyalıyorsun, Claude ona göre çalışıyor.

2. **Projeyi denetler.**
   *Sen yazıyorsun:* "kontrol et yanlış bir şey var mı"
   *Asistan üretiyor:* BLOCKER / MAJOR / MINOR finding listesi — her birine paste-ready fix prompt'u eşliğinde. Düzeltmiyor, sadece "şu ne, nerede, nasıl çözülür" raporu.

3. **Güvenlik taraması her seferinde.**
   Sen istemesen bile her AUDIT çıktısında: hardcoded secret, command injection, SSRF, path traversal, .env leak gibi 10+ kontrol. Bulursa BLOCKER severity.

### Ne ZAMAN devreye girer?

| Sen ne yazarsın | Asistan ne yapar |
|-----------------|-------------------|
| "X yap, Y ekle, Z kur" | BUILD modu — düzgün prompt üretir |
| "kontrol et / audit / denetle" | AUDIT modu — finding raporu |
| "güvenlik / secure mu" | AUDIT — scope: sadece güvenlik, daha derin |
| 3+ dosya / yeni feature | `/grill-me` skill'ine yönlendirir, BUILD'i atlar |
| Casual sohbet ("teşekkürler", "öğle yemeği yedim") | Devreye girmez, Claude düz cevap verir |

### Ne YAPAMAZ?

- Test çalıştırmaz, kod execute etmez, dosya yazmaz (tool: `Read / Grep / Glob` only).
- AUDIT'te kodu düzeltmez — "fix prompt" verir, sen yeni Claude session'da kopyala-yapıştır çalıştırırsın.
- Verified result vaad etmez — her output'un sonunda "şunu çalıştır, şunu bekle, beklediğin gibi değilse..." doğrulama adımı bulunur.

### Modu nasıl değiştiririm?

`CLAUDE.md` → `## Yardımcı asistan modu` bölümünde 4 mode var:

- **(a) Her mesajda** — "yap/ekle/kur" tarzı her isteğinde devreye girer (her mesajda 1-2 sn bekleme, en yüksek kalite)
- **(b) İş-bazlı** *(default)* — yeni iş başlatırken + "kontrol et" derken devreye girer (çoğu kullanıcı için doğru denge)
- **(c) Manual** — sen "asistana sor" / "denetle" diyene kadar uyumaz
- **(d) Kapalı** — asistan dosyası yok

Kullanıcı *"asistanı manual'e al"* derse Claude `CLAUDE.md`'deki "Mevcut seçim" satırını + `prompt-engineer.md`'deki `description:` satırını tek mesajda günceller.

### Nasıl kapatırım?

İki yol:
1. **Geçici:** "asistana sorma, direkt yap" de — Claude o mesaj için bypass eder.
2. **Kalıcı:** mode'u `(d) kapalı`'ya al (yukarıdaki "Modu nasıl değiştiririm" adımı). Asistan dosyası diskte kalır ama tetiklenmez. Geri açmak için tekrar mode değiştir.

### Örnek

`prompt-engineer.md` dosyasının altında 4 örnek var:
- **Example A** — Tiny task (1 satır log değişikliği)
- **Example B** — Medium task (yeni test ekleme, multiple file)
- **Example C** — Cron / standalone (haftalık otomatik özet)
- **Example D** — AUDIT (3 finding: BLOCKER + MAJOR + MINOR)

---

## EN — English

### What is this?

The "helper assistant" in your project. When you ask Claude Code something in plain English, this small agent first turns your request into a clean instruction + audits the project when asked.

### What does it do?

1. **Turns casual requests into clean prompts.**
   *You write:* "build a slack bot that posts when a new github issue lands"
   *Agent produces:* a 30-line paste-ready prompt — what to do, constraints, verification step, security pass included. You copy it; Claude works from that.

2. **Audits the project.**
   *You write:* "check / audit / review"
   *Agent produces:* BLOCKER / MAJOR / MINOR findings list — each with a paste-ready fix prompt. It doesn't fix anything; it produces a "what's wrong, where, how to fix" report.

3. **Always-on security pass.**
   Whether you asked or not, every AUDIT runs 10+ checks: hardcoded secrets, command injection, SSRF, path traversal, .env leak. Any finding = BLOCKER severity.

### When does it kick in?

| What you write | What the agent does |
|----------------|---------------------|
| "do X, add Y, set up Z" | BUILD mode — clean prompt |
| "check / audit / review" | AUDIT mode — findings report |
| "security / secure" | AUDIT — scoped to security, deeper |
| 3+ files / new feature | Defers to `/grill-me` skill, skips BUILD |
| Casual chat ("thanks", "had lunch") | Stays silent, Claude answers directly |

### What it CAN'T do

- No test execution, no code run, no writes (tool restriction: `Read / Grep / Glob` only).
- AUDIT doesn't fix code — produces "fix prompts" only; you copy-paste them into a fresh session per finding.
- Doesn't claim verified results — every output ends with a verification step ("Run X. Expect Y. If not, ...").

### How to change mode

`CLAUDE.md` → `## Yardımcı asistan modu` section has 4 modes:

- **(a) every message** — kicks in on every imperative request (1-2s wait per message, highest quality)
- **(b) job-based** *(default)* — wakes at start of new work + when you say "check/review" (right balance for most users)
- **(c) manual** — silent until you say "ask the assistant" / "audit"
- **(d) off** — agent file isn't loaded

If you say *"set the assistant to manual"*, Claude will update both files (this README's parent + CLAUDE.md) in a single edit.

### How to disable

Two ways:
1. **Temporary:** say "skip the assistant, do it directly" — Claude bypasses for that message.
2. **Permanent:** switch mode to `(d) off` (see "How to change mode" above). The agent file stays on disk but isn't triggered. To re-enable, switch mode again.

### Examples

See bottom of `prompt-engineer.md`:
- **Example A** — Tiny task (single-line log tweak)
- **Example B** — Medium task (add a test, touches multiple files)
- **Example C** — Cron / standalone agent (weekly auto-summary)
- **Example D** — AUDIT (3 findings: BLOCKER + MAJOR + MINOR)

---

## See also

- `prompt-engineer.md` — full agent instruction (machine-readable, ~350 lines)
- `CLAUDE.md` — `## Yardımcı asistan modu` section (mode toggle inline)
- `.claude/skills/` — skills the agent may pair with (`/grill-me` for non-trivial scope, `/agent-approval` for risky actions, `/verify-agent-output` for independent verification)
