# layermark-starter site

Public landing for layermark-starter. Next.js 15 + Tailwind. Static export (no backend).

## Local dev

```bash
cd site
npm install
npm run dev
# http://localhost:3000
```

## Build (static export)

```bash
npm run build
# Output: site/out/  — static HTML+CSS+JS
```

## Deploy

### Vercel (en kolay)

1. Vercel dashboard'da "New Project"
2. GitHub'dan `layermark-starter` repo'sunu seç
3. **Root Directory: `site`** (önemli — repo root'una deploy etme)
4. Framework: Next.js (auto-detect)
5. Deploy

### Cloudflare Pages

1. Cloudflare > Pages > Create
2. Build command: `cd site && npm install && npm run build`
3. Output: `site/out`

## Yapı

```
site/
├── app/
│   ├── layout.tsx           # root layout, metadata
│   ├── page.tsx             # landing
│   ├── start/page.tsx       # Yol A (GitHub template) + Yol B (zip)
│   └── globals.css
├── public/                  # static assets
├── tailwind.config.ts
├── next.config.js           # output: 'export' (static)
└── package.json
```

## Roadmap

- **Level 1 (DONE):** Landing + 2-yol start sayfası (use-template + zip)
- **Level 2 (TODO):** Browser-içi wizard — TR/EN seçici, kit selector, JSZip ile lokal scaffold üretimi
- **Level 3 (TODO):** SaaS — GitHub OAuth, otomatik repo create, eventual paid tier (intel pipeline managed, vs.)

`SITE-PLAN.md` (parent dir) detaylar.
