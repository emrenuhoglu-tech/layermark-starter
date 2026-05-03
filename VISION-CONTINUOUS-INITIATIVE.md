# Vision: Continuous-Initiative Agent

> **Status:** Strategy doc. Not implemented. Decision gated on Yücel/early-user feedback.

## Bağlam

Senin sorduğun: *"Bu üründe insanlara da doğru sekilde projeyi kurup yonetmeleri ve sonra da dogru sekilde yonlendirmesi icin danismanlik yapacak bir agent var mi?"*

Yani — **proaktif** bir agent. Wizard 9 soruyu sorduktan sonra ortadan kaybolmayan, kullanıcı stuck olduğunda **kullanıcı sormadan** araya giren bir Claude.

## Doctrine ile gerilim

3 ana doctrine bu fikirle çelişir:

### 1. Pocock: "Pre-build skill = bloat"

Inner-loop test kuralı: skill yarat ancak kullanıcı **2-3x/gün + aynı pattern + preloaded context yardım eder** dediğinde. Continuous-initiative agent **henüz var olmayan friction'ı çözmek için** önceden yapılır → bloat riski.

### 2. Mario "compounding boos" (AI Engineer)

Her ajana review-agent eklemek = "Ouro" döngüsü, slop birikir. Continuous agent eğer **kullanıcı sormadan** yorum yapıyorsa → kullanıcı için noise, dikkatini dağıtır, gerçek iş yavaşlar.

### 3. Karpathy "don't bet against the model"

Önümüzdeki 6 ay içinde Anthropic muhtemelen Claude Code'a **her session başında recap + suggestions** ekler (zaten `/agents` sistemi var). Bizim custom continuous-agent'ımız 3 ay sonra duplicate olur.

## Yine de neden konuşmaya değer

Karşı argüman:
- Non-coder kullanıcı **bilemediği şey için yardım isteyemez** ("unknown unknowns" problemi)
- 9-sorulu wizard sonrası kullanıcı **yalnız kalır** — projesinin yarın nereye gideceğini Claude'a sormayı bilmeyebilir
- Doctrine "pre-build skill" diyor ama **bu skill değil, agent** — farklı kategori

## 3 implementation seçeneği — sıralı, minimum-iş ile başla

### Seçenek 1 — Static prompts (zaten yapıldı)

`ne-yapayim.md` skill'i + `TASK END auto-pass` doctrine. Kullanıcı stuck olduğunu fark edip `/ne-yapayim` der → 4 seçenek menüsü çıkar. Bu **pull**-mode initiative.

**Durum:** ✅ canlı.
**Friction çözüyor mu:** Belki — Yücel feedback'i göstersin.

### Seçenek 2 — Periyodik UserPromptSubmit hook'u (~2 saat iş)

`prompt-log.ps1` hook'u zaten her prompt'u kaydediyor. Ek hook: **her 50. prompt'ta veya 24 saat sonra**, kullanıcı bir şey yazdığında Claude'un response'una **prepended** mesaj eklesin:

```
[ne-yapayim çağırmayı dene — 3 günlük session, audit zamanı?]
```

Bu **silent push**-mode. Kullanıcı görmezden gelebilir, friction'a yol açmaz.

**Durum:** TODO, validation gated.
**Risk:** Hook frequency yanlış calibrate edilirse spam. 50 prompt threshold doğru mu? Bilmiyoruz — A/B yapmadık.

### Seçenek 3 — True continuous agent (~1 hafta iş)

Background scheduled task — günde bir kez:
1. Son 24 saatin `prompt-log.md`'sini oku
2. Pattern detect: aynı hata 3+ kez? Stuck soru loop'u? CLAUDE.md drift?
3. **Sadece pattern bulursa** kullanıcıya markdown notu yaz (`02-memory/_advisor/YYYY-MM-DD.md`)
4. Bir sonraki Claude session'ında bu nota link versin

Bu **batched intelligence** — slop yapmaz çünkü pattern olmadıkça konuşmaz.

**Durum:** TODO, sadece Seçenek 2 başarılı olduktan sonra.
**Niye 1 hafta:** pattern detection prompt'u, schedule sistemi, false-positive rate calibration.

## Karar matrisi

| Seçenek | Şimdi yap mı? | Niye |
|---|---|---|
| 1 (yapıldı) | ✓ canlı | Zaten zero-cost, pull-mode, kullanıcıyı zorlamıyor |
| 2 (hook) | **HAYIR — Yücel feedback bekle** | Threshold calibration için en az 1 user gerek |
| 3 (background) | **HAYIR — Seçenek 2 sonrası** | Pre-build skill. Bitter Lesson: Anthropic 3 ayda yapacak |

## Tetikleyici — ne zaman Seçenek 2'ye geç

Aşağıdakilerden **en az 2'si** olunca:
- ☐ ≥3 user feedback raporu, hepsi "wizard sonrası ne yapacağımı bilmedim" diyor
- ☐ ≥1 user `prompt-log.md` paylaştı → gerçekten 50+ prompt yazdı, idle session var
- ☐ Anthropic'in `/agents` sistemi henüz periyodik suggestion eklemedi

Bu kriterler tutarsa:
1. Hook'u **disabled-by-default** ekle (`settings.json.example` içinde stub)
2. Threshold'u **konservatif** seç (50 prompt, 24h cooldown)
3. Kullanıcıya `/yardim` bağla — eğer push mesajı yararsız ise hook'u kapatma yolu kolay olsun

## Doctrine update — eğer Seçenek 2 başarılı olursa

CLAUDE.md.tmpl'a 15. doctrine eklenir:

> **Push initiative.** Wizard ve skill'ler pull-mode. Eğer kullanıcı 24 saat boyunca stuck pattern gösterirse (aynı hata 3+ veya idle 50+ prompt), Claude **kullanıcı sormadan** `ne-yapayim` veya `project-advisor` öner. Frequency cap: 1/24h. Kullanıcı dismiss ederse 7 gün sus.

**Bu doctrine eklenmez,** Seçenek 2 inner-loop test'i geçmedikçe.

## Sonuç — şu an yapılacak ne?

**Hiçbir şey.** Seçenek 1 yeterli. Yücel feedback'ine göre Seçenek 2 başlar.

Bu doc, niye **şimdi yapmadığımı** açıklıyor — gelecekte "hadi continuous agent yapalım" istediğinde önce buraya bak.
