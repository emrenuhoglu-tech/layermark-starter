# layermark-starter

Claude Code projeleri için interaktif kurulum şablonu. Anthropic'in agentic engineering prensiplerinden distile. Soru-cevap ile ilk projeyi 1 dakikada doğru iskelette başlatır.

## Ne kuruyor

- **Minimal `CLAUDE.md` + first-run wizard** — "do the minimal possible thing." Doctrine 22 satır. İlk session'da Claude 9 sorulu onboarding wizard çalıştırır (what/who/why → success/verification → stack/secrets/constraints → first file), sonra wizard bloğunu CLAUDE.md'den siler.
- **`prompt-engineer` agent** — casual istek → structured prompt + AUDIT mode (mevcut yapıyı denetler).
- **`.claude/skills/`** — boş başlar; inner-loop (2-3x/gün + same pattern) test'iyle organik büyür.
- **`knowledge/`** — Karpathy 3-layer (`raw/` + `wiki/` + `schema.md`) opsiyonel.
- **Intel pipeline (opsiyonel)** — günlük YouTube + X tarama, transkript, video transcribe (Whisper).
- **Stack iskeleti** — Python / Node.js / Web (TS+React) / None (docs-only).
- **Git init + GitHub repo** — opsiyonel, gh CLI ile otomatik.

## Kurulum — iki yol

İki entry point var. Senin durumuna göre seç:

### Yol A — Python script (deterministik, hızlı, $0 maliyet)

```bash
git clone https://github.com/emrenuhoglu-tech/layermark-starter
cd layermark-starter
python setup_starter.py
```

Script CLI'da soru-cevap yapar; <1 saniye'de iskelet. Önkoşul: Python 3.10+. Claude Code kurulu olmasına gerek yok. CI/automation için ideal.

### Yol B — Software 3.0 paste prompt (conversational, plan-mode native)

Zaten Claude Code session'ındaysan:

1. [STARTER-PROMPT.md](./STARTER-PROMPT.md) dosyasını aç
2. Tüm içeriği kopyala
3. Claude Code session'ında yapıştır
4. Sorulara cevap ver, planı onayla, hazır

Avantaj: agent yorumlar (esnek input), plan-mode native (diff göster, onaya sun), failure recovery için konuşmaya devam edebilirsin. Maliyet: ~$0.20/run + 30-60sn. Önkoşul: Claude Code zaten çalışıyor olmalı.

### Hangi soruları soruyor

- Proje adı + hedef klasör
- Stack (Python / Node / Web / None)
- (Yol A only) Intel pipeline + watchlist preset (Layermark-internal)
- Knowledge base hemen kurulsun mu?
- git init + gh repo create?

## Önkoşullar

- Python 3.10+ (`pyyaml` opsiyonel — preset watchlist'i yazabilmek için)
- (Opsiyonel) `gh` CLI — GitHub repo otomatik oluşturma için

## Layermark-internal vs external kullanım

Bu starter iki bağlamda çalışır:

**External (genel kullanım — herkes):** Soruları cevaplayıp **intel'i "hayır"** seçince temiz bir Claude Code projesi kurulur. `prompt-engineer` agent template'in içine vendored — pylib gerekmez. İhtiyacın olan tek şey Python 3.10+ ve (istersen) `gh` CLI.

**Internal (Layermark stack):** Intel pipeline (YouTube + X scan + Whisper transcribe) için ortak `~/.layermark/pylib/` ve `~/.layermark/secrets/` setup'ı şart. Bu external user'da yok — intel'i "yes" derse kibarca skip edilir.

External user için tipik akış:
- Stack: Python / Node / Web / None
- Intel: **Hayır**
- Watchlist: None
- KB: tercihe göre
- git init: evet, GitHub: tercihe göre

## Felsefe

Bu starter doctrine'i kendi kendine uygular:
- Minimal başlar, organik büyür
- Skills pre-shipped değil — kullanıcı 2-3x/gün pattern yaşayınca yapar (inner-loop test)
- Knowledge base sadece kullanıcı raw source'u koyduğunda kurulur
- prompt-engineer agent BUILD + AUDIT moduyla doctrine ihlallerini sürekli yakalar

## Yapı

```
layermark-starter/
├── README.md              # bu dosya
├── setup_starter.py       # interaktif bootstrap
├── template/              # kopyalanacak iskelet
│   ├── CLAUDE.md.tmpl
│   ├── README.md.tmpl
│   ├── .gitignore
│   ├── .env.example
│   ├── .claude/
│   │   ├── agents/        # prompt-engineer.md (vendored — pylib varsa override)
│   │   └── skills/README.md
│   └── knowledge/README.md
└── tests/
    └── smoke_test.py      # template'i tmp'ye kurar, doğrular
```

## Lisans

MIT (kişisel kullanım — yine de fork eden için açık).
