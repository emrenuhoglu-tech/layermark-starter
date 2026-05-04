# layermark-starter

**Claude Code projeleri için 1 dakikalık kurulum şablonu.** Anthropic'in agentic engineering prensiplerinden distile — Pocock + AI Engineer Conf + Anthropic Engineering + Karpathy doctrine'i pre-shipped.

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](https://github.com/emrenuhoglu-tech/layermark-starter/generate)
[![Live demo](https://img.shields.io/badge/Live%20demo-output%20repo-blue?style=for-the-badge&logo=github)](https://github.com/emrenuhoglu-tech/layermark-demo-ai-assistant)

> 🇬🇧 **English speakers:** see [README.en.md](README.en.md). The wizard inside Claude Code also asks language at the start.

---

## 🧭 Niye var? — origin story

İlk kez Claude Code açan herkes aynı 3 günlük çukura düşer: boş `CLAUDE.md`, dağılan context, "şimdi ne?" hissi, tekrar başla. Bu starter o çukuru atlamak için var. Üç kaynaktan distile edildi:

- **Matt Pocock** (Sand Castle, AI Engineer 2026) — smart-zone (~100K), Memento pattern, inner-loop test, "fewer + better skills"
- **AI Engineer Conf 2026** — Sandipan'in distributed-systems orchestrator pattern'i, Anthropic MCP guidance, Cursor "200 LoC skill replaced 12K LoC" lesson
- **Anthropic Engineering** (2026-05) — Claude Code auto-mode classifier, scaling Managed Agents (brain/hands/session decoupling), demystifying evals (multi-grader rubric), eval-awareness defense, Project Vend red-team primitive
- **Andrej Karpathy** — Software 3.0, Bitter Lesson, surgical changes, "don't bet against the model"

20 doctrine + 14 foundational skill + 10 domain kategori + opinionated wizard → kutudan çıkar çıkmaz çalışır.

**10 domain kategori** (Phase 0.3'te wizard sorar): Otomasyon · İçerik & medya · Yazılım & ürün · Oyun · Veri & analiz · **Finans & muhasebe & audit** *(HIGH RISK)* · **Hukuk & uyumluluk** *(HIGH RISK)* · Pazarlama · Eğitim · Kişisel. Her kategori için 5-10 pattern boilerplate (`02-memory/category/<slug>.md`). HIGH-RISK kategoriler otomatik production-grade doctrine + `agent-approval` gate ile gelir.

---

## 🎯 Vanilla Claude Code vs layermark-starter — ne fark eder?

Boş klasörde `claude` çalıştırırsan Claude Code'u alırsın. Düşük doz değer önermesi: *"AI coding tool"*. Ama vanilla Claude Code:

| Vanilla Claude Code (boş klasör) | layermark-starter + Claude |
|---|---|
| ❌ `CLAUDE.md` yok → Claude her session'da projeyi sıfırdan keşfeder | ✅ Wizard'la kişiselleştirilmiş `CLAUDE.md` (300-400 satır, doctrine #10 *tiny CLAUDE.md* uyumlu) |
| ❌ `/init` çalıştırırsan: 200+ satır generic boilerplate (Anthropic'in kendi Doctrine #10 ihlal eder) | ✅ İlk session protokolü A→G — `/grill-me` → test-first → implement → verify → memory → audit |
| ❌ **0 skill** — `/grill-me`, `/failing-test-as-prompt`, `/verify-agent-output`, `/agent-approval`, `/suspend`, `/resume`, `/project-advisor` slash command'larının hiçbiri yok | ✅ **14 foundational skill pre-loaded** (`.claude/skills/`) — hepsi inner-loop test'i geçer (2-3x/gün + aynı pattern + preloaded context yardım eder) |
| ❌ **Subagent yok** — casual istek ("X yap") → structured prompt'a otomatik dönüşmez | ✅ **prompt-engineer subagent** — BUILD modu (casual → structured) + AUDIT modu (proje doctrine ihlalleri) + always-on security pass (secrets/injection/SSRF/path traversal) |
| ❌ Domain-blind — finans projesi de oyun projesi de aynı muameleyi görür | ✅ **10 kategori** — HIGH-RISK auto-elevation (finans/hukuk → 5 production doctrine + `agent-approval` gate zorunlu) |
| ❌ Verification self-reported — Claude *"yaptım"* der, sen kontrol etmezsen bilemezsin | ✅ Doctrine #6 (Verification) + `/verify-agent-output` skill — bağımsız 2. yol, multi-grader rubric |
| ❌ Multi-agent için scaffold yok | ✅ Phase 0.5 multi-agent gate + `02-memory/orchestrator-safety.md` (saga + circuit breaker patterns) + Doctrine #15-20 production opt-in |
| ❌ Eval-awareness, red-team, eval-as-CI-gate gerekirse sıfırdan yazarsın | ✅ 5 production doctrine doc (`02-memory/doctrine/`) — auto-mode-classifier, brain-hands-decoupling, multi-grader-eval, eval-awareness, red-team-primitive |

### Skill'ler nereden geliyor?

14 skill'in hiçbiri *"yararlı olur diye"* yazılmadı. Her birinin **pre-shipping kanıtı** var (`.claude/skills/<name>.md`'in son bölümünde *"Why this exists pre-shipped"*):

- **`/grill-me`** — Pocock'un Anthropic Academy course'unda primary pattern. Non-trivial iş başında shared understanding'e ulaşma (tek soru, recommend-first).
- **`/skill-creator`** — Pocock'un meta-skill'i. Yeni skill kararı için ASSESS / ADVISE / CREATE 3 yol; inner-loop test'i operationalize eder.
- **`/agent-creator`** — Anthropic Engineering "scaling Managed Agents" doctrine'inden. 3-mod subagent yaratıcı (BUILD / AUDIT / SECURITY).
- **`/project-advisor`** — Pocock'un weekly-audit pattern'i. HIGH-RISK kategorilerde Step 1.5 (immutable ledger, double-entry, jurisdiction citation kontrolü).
- **`/yardim`, `/suspend`, `/resume`** — Memento doctrine (Pocock D3) operationalize. Compact = sediment; fresh window + checkpoint zorunlu.
- **`/sync-drift`** — multi-folder drift. Karpathy 3-layer KB pattern'inde wiki ↔ raw alignment.
- **`/ne-yapayim`** — idle-prompt 4-option menu. "Şimdi ne?" hissini yapısal route'a dönüştürür.
- **`/spagetti-check`** — code-smell tier-1 (350+ satır, deep nesting, duplikasyon).
- **`/ubiquitous-language`** — DDD ubiquitous-language. Ekip + Claude'un terminoloji glossary'sini ortak tutar.
- **`/failing-test-as-prompt`** — verification-first. Test kırmızıdan başlar, spec yanlışsa A'ya dön.
- **`/agent-approval`** — HIGH-RISK kategorilerde her significant action gate'i.
- **`/verify-agent-output`** — Doctrine #6 implementation. Multi-grader rubric'in deterministic pillar'ı.

**Her birinin yanında kategori-spesifik tetikleyici** (`02-memory/category/<NN>-<slug>.md` *Önerilen skill'ler* bölümü). Vanilla Claude Code'da bu yok — o slash command'ları kendin yazıp inner-loop test'inden geçirmen gerekir.

### Prompt-engineer agent — vanilla'da yok

`.claude/agents/prompt-engineer.md` — **2-mod + always-on security pass** subagent. 8 training doc (Anthropic Academy 5-course "Claude Partner Training" + Pocock + AI Engineer 9-talk + Anthropic Engineering 5-doctrine) damıtılarak yazıldı. Vanilla Claude Code'da subagent **kavramı** var (Anthropic Engineering "Managed Agents" 2026-05) ama **template + training corpus pre-loaded** değil — kendin yazarsın, inner-loop test'inden geçirirsin, training doc'ları kendin distile edersin.

**Detay + kanıt:** [/why](https://emrenuhoglu-tech.github.io/layermark-starter/why) — her doctrine'in kaynak referansı + commit hash, 14 skill kataloğu, agent training corpus listesi.

---

## 📐 Before / After — kuruluş öncesi vs sonrası

**Boş `claude /init` çıktısı (starter olmadan):**

```text
my-project/
├── CLAUDE.md          # 8 satır generic boilerplate
└── (else nothing)
```

→ `CLAUDE.md` Anthropic'in default sycophant dolgu metnidir. Hiç doctrine, hiç skill, hiç yapı.

**`python setup_starter.py` çıktısı (AI Asistan kit, ~1 sn):**

```text
my-bot/
├── CLAUDE.md                   # 20 doctrine + 10-soru wizard (TR/EN, hızlı mod 4-soru)
├── README.md                   # proje skeleton
├── .gitignore + .env.example   # secret hijenı
├── requirements.txt
├── pyproject.toml
└── .claude/
    ├── agents/
    │   └── prompt-engineer.md  # BUILD + AUDIT + always-on security
    ├── hooks/
    │   ├── prompt-log.ps1      # Win UserPromptSubmit hook
    │   └── prompt-log.sh       # Mac/Linux versiyonu
    ├── settings.json.example
    └── skills/                 # 14 foundational skill
        ├── grill-me.md         # interview before non-trivial work
        ├── skill-creator.md    # ASSESS / ADVISE / CREATE
        ├── agent-creator.md    # 3-mod subagent yaratıcı
        ├── project-advisor.md  # aylık audit
        ├── yardim.md           # TR/EN troubleshooting
        ├── suspend.md          # Memento operationalize
        ├── resume.md           # companion to suspend
        ├── sync-drift.md       # multi-folder drift detection
        ├── ne-yapayim.md       # idle-prompt 4 option menu
        └── spagetti-check.md   # code-smell tier-1
```

→ Her dosya inner-loop test'i geçen, gerçek pratik. **Boş repo değil — kurulu doctrine.**

---

## ⚖ Niye bu, no-code yerine?

| Şey | Bubble / Lovable / v0 / atoms.dev | layermark-starter |
|---|---|---|
| Hız (ilk MVP) | 5 dk | 10 dk |
| Backend / Python erişimi | Sınırlı | Tam |
| Vendor lock-in | Yüksek | Sıfır (kendi GitHub repo'n) |
| Aylık ücret | $20-300 (atoms: $20-100, Bubble: $29+) | $0 (sadece Claude Code subscription) |
| AI agent / subagent kontrolü | Yok / kapalı kutu | Tam (kendi `.claude/` klasörün) |
| Doctrine / opinionated yapı | Generic templates | Pocock + AI Engineer + Anthropic Engineering distilled |
| Çıkış kapısı | Export sınırlı (atoms: GitHub sync) | `git clone` → her şey senin |
| AI compute kim ödüyor | Onlar (credit'lerin biter) | Sen (kendi Claude aboneliğin) |

**Cevap:** Eğer *"sadece bana uygulama yaz, kod görmek istemiyorum"* diyorsan → atoms.dev / Lovable / Bubble doğru tercih. Eğer **kontrol**, **AI agent görünürlüğü**, **vendor lock-in yok**, **bedava** istiyorsan → bu starter.

---

## 💼 Premium kit'ler — yakında (waitlist)

Core starter sonsuza dek **MIT açık kaynak**. Üstüne, niş kullanım için curated kit'ler hazırlıyoruz ($29-49 one-time, lifetime updates):

- 🛒 **E-ticaret kit** — Shopify/WooCommerce + WhatsApp + iade akışı + stok takip
- 🏢 **Ajans kit** — White-label client projesi şablonu + invoice + onboarding
- ✍ **Content creator kit** — Newsletter + video script + SEO + cross-post
- 🚀 **SaaS founder kit** — Landing + waitlist + Stripe + onboarding emails

**Niyet sinyali:** İlgileniyorsan [Discussions'da kit waitlist'e yaz](https://github.com/emrenuhoglu-tech/layermark-starter/discussions/new?category=ideas). 20+ kayıt olursa o kit'e başlarız. **Hiçbir şey yok = product-market fit yok = boşa kit yapmayız.**

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
[4. CLAUDE.md ilk-açılış wizard'ı 10 soru sorar (TR/EN seçimi en başta + kategori dahil)]
  ↓
[5. Hazır iskelet, doctrine, foundational skill'ler — projeye başla]
```

---

## 🎯 3 hazır kit — bir tanesini seç, gerisi otomatik

| Kit | Ne için | İçeriği |
|---|---|---|
| 🤖 **AI Asistan** | Müşteri mesajlarına cevap, takvim, mail, chatbot | Python, intel pipeline yok, basit |
| 📊 **İçerik Takip** ⚠ | YouTube/X kanalları tarayıp özet bot'u | Python, watchlist + knowledge base + (Layermark-internal scan script'leri) |
| 📝 **Boş Sayfa** | Ne yapacağına sen karar vereceksin | Wizard tüm soruları sorar |

> **⚠ İçerik Takip kit hakkında:** YouTube/X scan script'leri (`scripts/intel_scan.py`, `scripts/x_intel_scan.py`) Layermark internal infrastructure (`~/.layermark/pylib/`) gerektirir. Dış kullanıcı seçerse: kategori boilerplate + watchlist preset + knowledge base alır, ama **scan script'leri yok**. Watchlist'i kendin manuel besleyebilirsin. Tam intel pipeline için: AI Asistan veya Boş Sayfa kit + kendi script'lerini ekle.

---

## 🚀 Kurulum

### En hızlı yol — GitHub "Use Template"

1. **[Use this template](https://github.com/emrenuhoglu-tech/layermark-starter/generate)** butonuna tıkla
2. Yeni repo adını gir, oluştur
3. Lokale klonla → `python setup_starter.py` → `claude`

Toplam: ~2 dk. GitHub hesabın yoksa aşağıdaki manuel yola geç.

### Manuel yol — 3 adım

#### 1. Önkoşulları kontrol et

**Tek satır kurulum** (önkoşullar tamam ise):

```powershell
# Windows PowerShell:
iwr -useb https://raw.githubusercontent.com/emrenuhoglu-tech/layermark-starter/main/check.cmd -OutFile check.cmd; .\check.cmd
```

```bash
# Mac/Linux:
curl -fsSL https://raw.githubusercontent.com/emrenuhoglu-tech/layermark-starter/main/check.sh | bash
```

Veya manuel:

```bash
git clone https://github.com/emrenuhoglu-tech/layermark-starter
cd layermark-starter
check.cmd          # Windows
bash check.sh      # Mac/Linux
```

Eksik olan varsa link verir, kur, tekrar çalıştır.

### 2. Bootstrap — iki yöntem var

**Yöntem A — Python script (deterministik, hızlı, Claude Code gerekmiyor):**

```bash
python setup_starter.py     # Windows
python3 setup_starter.py    # macOS / Linux (genelde `python` alias yok)
```

CLI'da kit + isim + kategori sorar (3 ana soru) → 1 saniyede iskelet. Önkoşul: Python 3.10+.

> **Mac kullanıcıları:** Modern macOS'ta `python` komutu yoktur, sadece `python3`. `command not found: python` hatası alıyorsan `python3` kullan. (`check.sh` çıktısında zaten doğru komut yazıyor.)

**Yöntem B — Software 3.0 paste prompt (zaten Claude Code session'ındaysan):**

1. [Site /start sayfasını aç](https://emrenuhoglu-tech.github.io/layermark-starter/start)
2. **"Prompt'u kopyala"** butonuna tıkla (kısa, ~70 satır, single-source-of-truth)
3. Claude Code session'ında yapıştır
4. Kit + isim + kategori sorularına cevap ver

Avantaj: agent `git clone` yapar + `setup_starter.py` çağırır, plan-mode native, her zaman güncel template. (Eski self-contained `STARTER-PROMPT.md` kaldırıldı — single source of truth = site/start.)

### 3. Yeni projeye geç + Claude Code aç

```bash
cd <yeni-proje>
claude
```

**Claude Code açılınca CLAUDE.md'deki ilk-açılış wizard'ı kendiliğinden tetiklenir** — TR/EN seçer, 10 soru sorar (kategori dahil), projeyi senin için doldurur, sonra wizard'ı CLAUDE.md'den siler. Tek seferlik.

---

## 🔧 Sorun çıkarsa

Claude Code'a sadece şunu yaz: **"`/yardim` çalıştır"** — pre-shipped `yardim` skill plain-Türkçe troubleshooting yapar (hata mesajını yapıştır, çevirir + ne yapacağını söyler).

Veya `02-memory/_intel/` (varsa) altında daha fazla doctrine + tools bilgisi.

---

## 📚 Pre-shipped — kutudan çıkanlar

### Doctrine (CLAUDE.md.tmpl)
20 doctrine — Pocock + AI Engineer + Anthropic Engineering distilled. Tam katalog: [/docs/doctrines](https://emrenuhoglu-tech.github.io/layermark-starter/docs/doctrines/)
- **Çekirdek (1-7):** Grill before build, Smart zone, Memento, Surgical changes, Simplicity first, Verification, Minimum permissions
- **Skill + workflow (8-14):** Inner-loop test, Rules emerge, Never `/init`, Hooks > prompts, Concise + unresolved, Anti-hallucination ("use your search tool"), Bitter Lesson
- **Production agent (opt-in, 15-20):** Orchestrator-only multi-agent, Auto-mode classifier customization, Brain/hands/session decoupling, Multi-grader eval rubric, Eval-awareness defense, Red-team primitive

### 14 foundational skill (`.claude/skills/`)
Decision tree için: [.claude/skills/README.md](template/.claude/skills/README.md)

- **İlk 10 dk:** `grill-me`, `ne-yapayim`
- **Yeni feature:** `grill-me` → `failing-test-as-prompt`, `ubiquitous-language`
- **Riskli action:** `agent-approval` → `verify-agent-output`
- **Stuck:** `yardim` → `suspend` → `resume`
- **Aylık temizlik:** `project-advisor`, `spagetti-check`, `sync-drift`
- **Skill / agent yaratma:** `skill-creator`, `agent-creator`

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
| **Otomasyon kategorisi** seçtin ama finans/audit projesi yapacaksın | **Finans & muhasebe & audit (HIGH RISK)** seç | HIGH-RISK kategori production doctrine docs'u (red-team, multi-grader eval, eval-awareness) zorla ekler. Otomasyon seçersen bu güvenlikler kopyalanmaz, audit'te bug'lar üretime sızar |
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
| **Doctrine** | Projenin kurallar bütünü. Bizimki Pocock + AI Engineer + Anthropic Engineering'den distile edildi |
| **Kit** | Hazır tech preset (3 tane): AI Asistan / İçerik Takip / Boş Sayfa. Stack + intel + kb defaultlarını tek seçimde verir |
| **Kategori** | Hangi domain'de çalıştığını söyleyen 10-seçenekli "ne tip proje" boyutu (otomasyon, içerik, finans/audit, hukuk, …). Kit'ten **orthogonal** — finans bot için "AI Asistan kit + Finans kategori" seçilebilir. HIGH-RISK kategoriler (finans, hukuk) production doctrine docs'u zorla ekler |

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
├── setup_starter.py         # interaktif bootstrap (Python yöntemi, kit + kategori sorar)
├── docs/internal/           # iç workshop notları (intel-extracted, premium-kits, vision, vb.)
├── template/                # her proje için kopyalanacak iskelet
│   ├── CLAUDE.md.tmpl       # doctrine + 10-soruluk wizard (kategori dahil)
│   ├── README.md.tmpl
│   ├── .gitignore + .env.example
│   ├── .claude/
│   │   ├── agents/          # prompt-engineer + README
│   │   └── skills/          # 14 foundational skill + decision-tree README
│   ├── 02-memory/
│   │   ├── category/        # 10 domain boilerplate (01-automation … 10-personal)
│   │   ├── doctrine/        # 5 production doctrine doc (opt-in: blank kit + HIGH-RISK)
│   │   └── orchestrator-safety.md  # multi-agent saga / circuit-breaker patterns (opt-in)
│   └── knowledge/README.md
└── tests/
    └── smoke_test.py        # template'i tmp'de kurar, doğrular
```

---

## 🎯 Live demo

**Starter'ın çıktısını gör:** [`layermark-demo-ai-assistant`](https://github.com/emrenuhoglu-tech/layermark-demo-ai-assistant)

AI Asistan kit'iyle 30 saniyede üretilmiş gerçek bir repo. README'de çıktı tree'si + ne kuruldu listesi.

## 🤝 Paylaşım

İstediğin kişiye 2 link gönder yeter:

1. https://github.com/emrenuhoglu-tech/layermark-starter (bu repo)
2. https://claude.ai/code (Claude Code kur)

Repo'da `check.cmd` çift-tıklamayla başlar. Pre-flight geçince `python setup_starter.py`. Wizard kit sordurur. Claude Code açıp paste yapar. Bitti.

## 💬 Geri bildirim

Bug, friction, feature isteği — [GitHub Issues](https://github.com/emrenuhoglu-tech/layermark-starter/issues/new/choose) (3 template var: bug-report / feedback / feature-request).

Erken kullanıcı geri bildirim planı: [`docs/internal/INVITES.md`](./docs/internal/INVITES.md).

## 🔄 Starter güncellenirse — migration

Starter **fork-and-forget** tasarlandı. Wizard tamamlandığında BEGIN/END block silinir, projen bağımsızlaşır. Üst-akış otomatik update yok by design (Karpathy "don't bet against the model").

**Yine de yeni bir doctrine / skill / kategori eklendi diye yeni projeye almak istersen:**

1. **Geçici çek:** `git clone https://github.com/emrenuhoglu-tech/layermark-starter /tmp/lm-fresh`
2. **Doctrine diff:** Yeni doctrine maddelerini gör (kendi CLAUDE.md'inle karşılaştır):
   ```bash
   diff <(awk '/^## Doctrine/,/^## /' CLAUDE.md) \
        <(awk '/^## Doctrine/,/^## /' /tmp/lm-fresh/template/CLAUDE.md.tmpl)
   ```
   Eksik #15-#20 (production opt-in) gibi maddeleri manuel taşı, kategori-spesifik notlarının üzerine yazma.
3. **Eksik skill listesini gör:**
   ```bash
   diff <(ls .claude/skills) <(ls /tmp/lm-fresh/template/.claude/skills)
   ```
   `>` ile başlayan satırlar yeni skill — sadece inner-loop test'ten geçenleri kopyala (`cp /tmp/lm-fresh/template/.claude/skills/<name>.md .claude/skills/`). Kullanmayacağın skill = ölü kod.
4. **Yeni kategori boilerplate:** Eğer `02-memory/category/` boşsa veya outdated, fresh template'ten taşı:
   ```bash
   cp /tmp/lm-fresh/template/02-memory/category/<NN>-<slug>.md 02-memory/category/
   ```
   Kategori değiştirmeyeceksen bu adım gereksiz.
5. **Bilinçli karar:** Çoğu zaman update yapmaya gerek yok — projen kendi disiplinini kurar, starter sadece tohum. Doctrine drift kontrolü için `/project-advisor` çağır, gerçekten eksik bir şey varsa onu surface'lar.

## 📜 Lisans

MIT.
