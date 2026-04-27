# layermark-starter

Yeni Claude Code projeleri için interaktif kurulum şablonu. Boris Cherny + Karpathy + Anthropic growth team prensiplerini distile eder, soru-cevap ile ilk projeyi 1 dakikada doğru iskelette başlatır.

## Ne kuruyor

- **Minimal `CLAUDE.md`** — Boris kuralı: "do the minimal possible thing." 25 satır altı.
- **`prompt-engineer` agent** — casual istek → structured prompt + AUDIT mode (mevcut yapıyı denetler).
- **`.claude/skills/`** — boş başlar; inner-loop (2-3x/gün + same pattern) test'iyle organik büyür.
- **`knowledge/`** — Karpathy 3-layer (`raw/` + `wiki/` + `schema.md`) opsiyonel.
- **Intel pipeline (opsiyonel)** — günlük YouTube + X tarama, transkript, video transcribe (Whisper).
- **Stack iskeleti** — Python / Node.js / Web (TS+React) / None (docs-only).
- **Git init + GitHub repo** — opsiyonel, gh CLI ile otomatik.

## Kurulum

```bash
git clone https://github.com/emrenuhoglu-tech/layermark-starter
cd layermark-starter
python setup_starter.py
```

Script soru-cevap yapar:
- Proje adı + hedef klasör
- Stack (Python / Node / Web / None)
- Intel pipeline ister misin?
- Watchlist preset (AI / Marketing / Indie / Custom / None)
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
- Minimal başlar, organik büyür (Boris)
- Skills pre-shipped değil — kullanıcı 2-3x/gün pattern yaşayınca yapar (Marchese inner-loop test)
- Knowledge base sadece kullanıcı raw source'u koyduğunda kurulur (Karpathy)
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
│   ├── .claude/
│   │   ├── agents/        # prompt-engineer pylib'den kopyalanır
│   │   └── skills/README.md
│   └── knowledge/README.md
└── tests/
    └── smoke_test.py      # template'i tmp'ye kurar, doğrular
```

## Lisans

MIT (kişisel kullanım — yine de fork eden için açık).
