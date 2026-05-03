# SCREENCAST — TODO: senin kaydetmen lazım

Agent görüntü kaydedemez. README'de Live Demo şu an sadece çıktı repo'su; **30-saniye gerçek kayıt** ile %5x conversion bekleniyor.

## 30-saniyelik script (kelimesi kelimesine)

> **0-5 sn:** "Claude Code projesini sıfırdan kurma — 30 saniyede gösteriyorum."
>
> *(ekranda boş klasör → terminal aç)*
>
> **5-10 sn:** `git clone .../layermark-starter && cd layermark-starter`
>
> **10-15 sn:** `python setup_starter.py` — kit seçici çıkıyor, "1) AI Asistan" seç
>
> **15-20 sn:** 4-5 soru soruyor (proje adı, dil, vs) — yanıtla
>
> **20-25 sn:** `cd <yeni-proje> && claude` — Claude Code açılıyor
>
> **25-30 sn:** Wizard 1. soruyu sordu (TR/EN selector) — "İşte buraya kadar 30 saniye, gerisini wizard halletti."

## Kayıt önerisi

- **Loom** (en hızlı, free tier yeter): https://loom.com → Chrome extension → "New recording" → screen + camera off
- **OBS** (offline, .mp4): biraz öğrenme eğrisi, ama profesyonel
- **ScreenRec** (Win, free, light): tek tık başlat-bitir

Kayıt sonrası:

1. Loom link / .mp4'ü `assets/demo.mp4` veya YouTube'a yükle (unlisted)
2. README'nin top'una ekle:
   ```markdown
   ## 🎥 30 saniyede ne kuruluyor (video)

   [![demo](assets/thumb.jpg)](https://loom.com/share/...)
   ```
3. `site/app/page.tsx` Hero section'a `<video>` veya iframe ekle

## Akıl-sıçraması: niye kritik

Non-coder'lar README okumuyor — **görmek istiyorlar.** "1 dakikada kurulum" iddiası vidyo olmadan abstract. Vidyo varsa Yücel'e link gönderdiğinde 30 saniye izleyip karar verir; vidyosuz: 5 dk README + scroll → büyük ihtimalle kapatır.

Bu README dosyası bu işin yapılması gerektiğini hatırlatmak için.
