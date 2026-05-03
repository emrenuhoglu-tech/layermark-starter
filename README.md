# layermark-starter

**Claude Code projeleri için 1 dakikalık kurulum şablonu.** Anthropic'in agentic engineering prensiplerinden distile — Pocock + AI Engineer + Karpathy + Cursor doctrine'i pre-shipped.

> 🇬🇧 English speakers: this README is in Turkish, but the wizard inside Claude Code asks at the start: *"Hangi dilde / Which language?"* — pick English and everything continues in English.

---

## ⚠ Bu starter SİZE göre **DEĞİL** eğer...

- Hayatınızda **terminal** açmamışsanız ve açmaya niyetiniz yoksa (web-only ChatGPT yeter)
- **Python**, **Node.js** ya da **git** nedir hiç duymamışsanız (önce 30 dk Google'layın)
- *"Sadece bana bir uygulama yaz"* arıyorsanız (no-code platformlar daha hızlı: Bubble, Lovable, v0)

**Bu starter SİZE göre eğer...**

- Claude Code'u kurdunuz, açtınız, ama "şimdi ne?" hissi var
- Birkaç defa kod kurcaladınız, AI ile proje açtınız, dağıldı, tekrar başladınız
- Aynı **opinionated yapı**'yı her projeye otomatik uygulamak istiyorsunuz
- Pocock/Karpathy disiplini vs lego setine sahip olmak istiyorsunuz

---

## 📋 Hızlı bakış — ne kuruyor

```text
[Sen]
  ↓
[1. check.cmd / check.sh — Python/git/Claude Code kurulu mu?]
  ↓
[2. python setup_starter.py — Kit seç, sorulara cevap ver]
  ↓
[3. cd <yeni-proje> && claude]
  ↓
[4. CLAUDE.md ilk-açılış wizard'ı 9 soru sorar (TR/EN seçimi en başta)]
  ↓
[5. Hazır iskelet, doctrine, foundational skill'ler — projeye başla]
```

---

## 🎯 3 hazır kit — bir tanesini seç, gerisi otomatik

| Kit | Ne için | İçeriği |
|---|---|---|
| 🤖 **AI Asistan** | Müşteri mesajlarına cevap, takvim, mail, chatbot | Python, intel pipeline yok, basit |
| 📊 **İçerik Takip** | YouTube/X kanalları tarayıp özet bot'u | Python, intel pipeline + watchlist + knowledge base |
| 📝 **Boş Sayfa** | Ne yapacağına sen karar vereceksin | Wizard tüm soruları sorar |

---

## 🚀 Kurulum — 3 adım

### 1. Önkoşulları kontrol et

```bash
# Önce repo'yu klonla
git clone https://github.com/emrenuhoglu-tech/layermark-starter
cd layermark-starter

# Pre-flight check (Python/git/Claude Code kurulu mu?)
# Windows:
check.cmd
# Mac/Linux:
bash check.sh
```

Eksik olan varsa link verir, kur, tekrar çalıştır.

### 2. Bootstrap — iki yöntem var

**Yöntem A — Python script (deterministik, hızlı, Claude Code gerekmiyor):**

```bash
python setup_starter.py
```

CLI'da kit seç + 4-5 soru → 1 saniyede iskelet. Önkoşul: Python 3.10+.

**Yöntem B — Software 3.0 paste prompt (zaten Claude Code session'ındaysan):**

1. [STARTER-PROMPT.md](./STARTER-PROMPT.md) dosyasını aç
2. Tüm içeriği kopyala
3. Claude Code session'ında yapıştır
4. Sorulara cevap ver, planı onayla

Avantaj: agent yorumlar, plan-mode native, fail durumunda konuşmaya devam.

### 3. Yeni projeye geç + Claude Code aç

```bash
cd <yeni-proje>
claude
```

**Claude Code açılınca CLAUDE.md'deki ilk-açılış wizard'ı kendiliğinden tetiklenir** — TR/EN seçer, 9 soru sorar, projeyi senin için doldurur, sonra wizard'ı CLAUDE.md'den siler. Tek seferlik.

---

## 🔧 Sorun çıkarsa

Claude Code'a sadece şunu yaz: **"`/yardim` çalıştır"** — pre-shipped `yardim` skill plain-Türkçe troubleshooting yapar (hata mesajını yapıştır, çevirir + ne yapacağını söyler).

Veya `02-memory/_intel/` (varsa) altında daha fazla doctrine + tools bilgisi.

---

## 📚 Pre-shipped — kutudan çıkanlar

### Doctrine (CLAUDE.md.tmpl)
14 satır kuralla başlar — Pocock + AI Engineer + Karpathy distilled:
- Grill before build, Smart zone (~100K), Memento, Surgical changes, Simplicity first
- Verification, Minimum permissions, Inner-loop test, Bitter Lesson
- Never `/init`, Hooks > prompt negatives, Concise + unresolved, Anti-hallucination, Rules emerge

### 5 foundational skill (`.claude/skills/`)
- **`grill-me.md`** — non-trivial iş başında shared-understanding interview (Pocock pattern)
- **`skill-creator.md`** — yeni skill yarat veya "ne skill yapsam?" → 3 mod (ASSESS/ADVISE/CREATE)
- **`agent-creator.md`** — yeni subagent yarat veya "ne ajan lazım?" → aynı 3 mod
- **`project-advisor.md`** — aylık proje audit, stale skill'leri yakalar, missing pattern'ler surface'lar
- **`yardim.md`** — plain-TR/EN troubleshooting helper (stuck'lık halinde)

### 1 subagent (`.claude/agents/`)
- **`prompt-engineer.md`** — BUILD modu casual istek → structured prompt; AUDIT modu doctrine ihlallerini yakalar.

### Optional intel pipeline
- `scripts/intel_scan.py` (YouTube), `scripts/x_intel_scan.py` (X/Twitter), `scripts/x_video_transcribe.py` (Whisper)
- Watchlist preset'leri (ai / marketing / indie)
- Junction-shared canonical store: `~/.layermark/intel/` (multi-project deploy)

### Optional knowledge base
- Karpathy 3-layer: `raw/` (kaynak dump) + `wiki/` (Claude sentezi) + `schema.md` (kurallar)

---

## ❌ Sık yapılan hatalar — bu hatalara düşme

| Hata | Doğrusu | Sebep |
|---|---|---|
| **AI Asistan kit** seçtin ama YouTube takip botu yapacaksın | **İçerik Takip kit** seç | Kit, intel pipeline'ı + watchlist'i pre-load eder |
| Wizard sorularını **boş geçtin** çünkü "bilmiyorum" | Her soruda altta **"Bilmiyor musun?"** safety-net cevabı var, onu yaz | Boş bırakırsan Claude implicit varsayım yapar, sürpriz çıkar |
| Claude Code aç**madan** `python setup_starter.py` çalıştırdın | Aslında doğru sıra! Önce setup, **sonra** Claude Code | Setup proje iskeletini yaratır, Claude Code wizard'ı sonra çalıştırır |
| `claude /init` çalıştırdın "düzelsin diye" | **Asla `/init` çalıştırma** — auto-generated CLAUDE.md sil | Doctrine: instruction budget ~300-500, `/init` sycophant ve bloat ekler |
| Skill yarattın çünkü "iyi olur" dedin | **Inner-loop test:** 2-3x/gün + aynı pattern + preloaded context yardım eder → o zaman skill | Pre-build skill = bloat. Friction yaşamadan skill = ölü kod |
| API key'i `.env` yerine kodun içine yazdın | **Asla** kodun içine yazma — `.env` dosyasını kullan, `.gitignore`'da | `.env` git'e gitmez, kod GitHub'a public'e gitse bile API key sızmaz |

---

## 📖 Glossary — non-coder için

| Terim | Plain açıklama |
|---|---|
| **Terminal** | Bilgisayara komut yazma penceresi. Mac: Spotlight'a "terminal", Win: Win+R → cmd |
| **Claude Code** | Terminal'de çalışan AI coding asistanı (web-ChatGPT'nin terminal versiyonu) |
| **Python** | En popüler programlama dili, otomasyon işleri için ideal |
| **`pip`** | Python kütüphane yükleyici. `pip install <ad>` ile bir paket indirilir |
| **API key** | Bir servisin (OpenAI, Twitter) seni tanıması için verdiği gizli kod (şifre gibi) |
| **`.env`** | Gizli değerlerin (API key vs.) yazıldığı dosya. Git'e gitmez |
| **Repository / repo** | Git ile takip edilen klasör. GitHub'da bir proje = repo |
| **`cd`** | Terminal'de klasör değiştir. `cd ..` üst klasöre |
| **Branch** | Kodun paralel versiyonu (main = ana, feature/X = denenen yeni özellik) |
| **Skill** | Claude'a "şu işi şöyle yap" diye önceden tanımlı talimat (slash command olur: `/<ad>`) |
| **Subagent** | Ana session'dan ayrı, kendi context'i olan Claude. Paralel/specialized iş için |
| **Doctrine** | Projenin kurallar bütünü. Bizimki Pocock + AI Engineer + Karpathy'den distile edildi |

---

## 💭 Felsefe

- **Minimal başlar, organik büyür** — pre-build skill = bloat
- **Doktrine kendi kendini uygular** — `prompt-engineer` AUDIT moduyla ihlali yakalar
- **Inner-loop test** — 2-3x/gün + aynı pattern + preloaded context yardım eder → o zaman skill yap
- **Bitter Lesson** — modele karşı bahis yapma; 6 ay sonra senin custom scaffold'un Claude'un feature'ı olmuş olur

---

## 🗂 Yapı

```text
layermark-starter/
├── README.md                # bu dosya
├── check.cmd / check.sh     # önkoşul kontrol (Python/git/Claude Code)
├── setup_starter.py         # interaktif bootstrap (Python yöntemi)
├── STARTER-PROMPT.md        # paste-into-Claude (Software 3.0 yöntemi)
├── template/                # her proje için kopyalanacak iskelet
│   ├── CLAUDE.md.tmpl       # doctrine + 9-soruluk wizard
│   ├── README.md.tmpl
│   ├── .gitignore + .env.example
│   ├── .claude/
│   │   ├── agents/          # prompt-engineer + README
│   │   └── skills/          # grill-me + skill-creator + agent-creator + project-advisor + yardim + README
│   └── knowledge/README.md
└── tests/
    └── smoke_test.py        # template'i tmp'de kurar, doğrular
```

---

## 🤝 Paylaşım

İstediğin kişiye 2 link gönder yeter:

1. https://github.com/emrenuhoglu-tech/layermark-starter (bu repo)
2. https://claude.ai/code (Claude Code kur)

Repo'da `check.cmd` çift-tıklamayla başlar. Pre-flight geçince `python setup_starter.py`. Wizard kit sordurur. Claude Code açıp paste yapar. Bitti.

## 📜 Lisans

MIT.
