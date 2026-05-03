---
name: ne-yapayim
description: Use when the user is silent, asks "ne yapsam?", "şimdi ne?", "nereye odaklanayım?", "what next?", or seems stuck/idle without specific request. Surfaces 4 concrete options with one-question-at-a-time framing — never barrage. Initiative WITH user control (sopa-tut prensibi).
---

Kullanıcı boş gelmiş ya da "ne yapsam" diye sormuş. Initiative al ama **kullanıcı kontrolü kaybetmesin** — tek menü göster, seçtirgir.

# Process

## Step 1 — Kontrol et: gerçekten idle mı?

Eğer son mesajdan beri **somut bir görev** geldiyse (kullanıcı X yap dedi, hata mesajı yapıştırdı, vs.), bu skill'i tetiklerken yanılıyorsun → çık, normal akışa dön.

Idle sinyalleri:
- "ne yapsam", "ne yapacağız", "nereden devam"
- Suspend doc var ama kullanıcı `/resume` çağırmadı — onu öner
- Boş enter / belirsiz mesaj
- "what next" / "stuck"

## Step 2 — 4 seçenek sun (BIR menü, BIR sefer)

```
Birkaç seçenek var, birini söyle:

1. **Audit** — `/project-advisor` ile mevcut durumu tara: stale skill, eksik pattern, drift uyarısı
2. **Brainstorm** — son commit'lere bakıp 3 olası "sıradaki adım" önereyim, sen seç
3. **Skill öner** — `/skill-creator` ADVISE mode: hangi skill projeye fayda eder
4. **Resume** — son suspend doc varsa onu yükle, oradan devam

Veya: "yok, sadece konuşalım" / "X yapalım" diyebilirsin (somut bir iş).
```

## Step 3 — Seçilene göre yönlendir

- **1** → `project-advisor` skill çağır
- **2** → Brainstorm: `git log --oneline -10` oku, son 5 dosya değişikliğini gör, **3 somut next-step** öner (her biri "X file'da Y feature ekle" formatında, vague yapma)
- **3** → `skill-creator` ADVISE mode tetikle
- **4** → `resume` skill çağır
- **"yok"** → DUR, sus, kullanıcı söyleyene kadar bekle

## Step 4 — Brainstorm specifically (option 2 için)

Vague "şunu yap" değil, somut:

```
Son commit'lerden 3 adım gözüküyor:

1. **<concrete action>** — file:line, neden iyi, effort
2. **<concrete action>** — ...
3. **<concrete action>** — ...

Hangisi? (numara yaz, ya da "hiçbiri" dersen başka açıdan bakarım)
```

# Hard rules

- **TEK menü, BIR sefer.** 4 seçenek tek mesajda, sonra kullanıcı seçene kadar sus.
- **Kullanıcı 'yok' / 'sus' derse SUS.** Idle-prompt re-trigger etme. 5 dk sonra başka mesaj geldiğinde değerlendirme yap.
- **Brainstorm vague olmaz.** "Belki şunu refactor etsen" YOK. "X.py satır 45 fonksiyon Y'yi Z şekline split et" GERÇEK.
- **Kullanıcı 'X yapalım' deyince menü unut.** Doğrudan iş'e geç.

# Anti-patterns

- ❌ Her sessiz an'ı idle algılayıp menüyü tekrar tekrar göster (annoying)
- ❌ 10 seçenek sun (decision fatigue)
- ❌ Brainstorm yapmadan generic "tests yazsan" / "doc güncellesen" öner (kanıtsız)
- ❌ Kullanıcı seçim yapmadan kendi başına audit/brainstorm başlat
- ❌ "Bu skill'i yarat" gibi BUILD action öner (skill-creator önce ASSESS yapmalı)

# Frequency

- Manuel tetikleme (kullanıcı `/ne-yapayim` çağırır)
- Otomatik proactive: kullanıcı **açıkça** "ne yapsam" / "nereye odaklanayım" / "stuck" derse
- ASLA: her boş mesajda
