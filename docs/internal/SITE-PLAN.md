# Site roadmap — Level 1 / 2 / 3

## Level 1 — Landing + GitHub use-template (DONE — live on GitHub Pages)

**Stack:** Next.js 15 + Tailwind, static export, GitHub Pages deploy via .github/workflows/deploy-site.yml.

**Pages:**
- `/` — Hero + What ships + How (3 step) + Kits + Anti-friction + Footer
- `/start` — 2 yol: (A) GitHub Use Template (önerilen), (B) Zip download

**Effort:** ~3 saat. CTA → GitHub `/generate` link (1-tık template instantiation).

**Önkoşul (kullanıcının):** GitHub hesabı (Yol A) veya hiçbiri (Yol B).

**Deploy adımları:**
1. Vercel dashboard > New Project
2. Import GitHub repo `layermark-starter`
3. Root Directory: `site`
4. Deploy → custom domain bağla (opsiyonel)

**Sonuç:** Layermark starter'ı bir link olarak insanlarla paylaşabilirsin. Use-template tek tık çalışır.

---

## Level 2 — Browser-içi wizard + JSZip (TODO, ~8-12 saat)

**Hedef:** Non-coder darboğazını çöz: zip download'a kadar gerek yok, browser'da tam scaffold üretimi.

**Yeni page:** `/wizard`

**Akış:**
1. TR/EN selector
2. Kit seç (3 hazır kit, açıklamalı kart)
3. Proje adı (TR olabilir, ASCII slug otomatik)
4. Stack (kit varsayılanı varsa atla)
5. Intel pipeline yes/no (kit varsayılanı varsa atla)
6. KB yes/no (aynı)
7. Plan tree göster
8. "Download" → JSZip ile in-memory scaffold üretimi → kullanıcı `<projename>.zip` indirir

**Stack additions:**
- [JSZip](https://stuk.github.io/jszip/) — browser zip generation
- React useState (form state)
- Template files JSON-encoded gömülü (build-time `getStaticProps` ile `template/*` okunur)

**Build adımı:** `site/scripts/embed-template.ts` — `template/` klasörünü `app/wizard/template-data.json` olarak embed eder. Wizard runtime'da bu JSON'dan zip kurar.

**Effort breakdown:**
- Wizard UI (5-step form): 3 saat
- Template embed script: 1 saat
- JSZip integration + slug logic: 2 saat
- Testing + polish: 2 saat

**Sınır:** Yine de kullanıcı zip'i çıkarıp `python setup_starter.py` çalıştıracak (lokal Python lazım). Tam SaaS değil, ama Yol B'den çok daha guided.

---

## Level 3 — SaaS, GitHub OAuth, managed (TODO, ~40-60 saat, fresh project scope)

**Hedef:** Tek-tık deploy, GitHub repo otomatik yaratılır, kullanıcı sadece `git clone` + `claude` çalıştırır. Eventually paid plan.

**Yeni stack:**
- Backend: Vercel API routes (Next.js full SaaS mode, çıkar `output: 'export'`)
- Auth: NextAuth.js + GitHub OAuth provider
- DB: Postgres (Vercel Postgres / Neon) — user records, project history
- GitHub API: Octokit (`@octokit/rest`)

**Akış:**
1. Kullanıcı `/wizard` doldurur
2. GitHub'a OAuth ile login ister (eğer Yol A seçtiyse)
3. Backend GitHub API ile repo create + initial commit (template content)
4. Kullanıcı clone link'i + 3 komut alır
5. (Opsiyonel paid) Intel pipeline managed — kullanıcı API key ekler, bizim cloud cron çalıştırır, sonuçları repo'ya commit'ler

**Monetization opsiyonları:**
- Free: unlimited public repo create
- Pro ($9/ay): private repo create, intel pipeline managed (bizim cloud), email/Discord destek
- Team ($29/ay/seat): multi-user workspace, role-based skill sharing, custom doctrine override

**Effort breakdown:**
- Backend infra (Vercel Postgres + NextAuth): 8 saat
- GitHub OAuth + repo create flow: 6 saat
- Wizard backend integration: 4 saat
- User dashboard (project list, manage): 8 saat
- Stripe integration: 6 saat
- Intel pipeline managed (cron + API key vault): 12 saat
- Testing, polish, docs: 8 saat
- **Total:** 40-60 saat sürer, MVP 2 hafta

**Risk:**
- Anthropic affiliate ilişki yok — Claude Code'u tanıtırken dikkat
- Hosting maliyetleri (Vercel free tier yeterli mi yoksa Railway?)
- GitHub API rate limits (5000/saat OAuth user, ücretsiz tier)

**Decision criteria — Level 3'e girer miyiz:**
- Level 1+2 iki ay kullanılır mı, organic kullanıcı sayısı nereye gider?
- 100+ aktif kullanıcı varsa Level 3 değer; yoksa overkill
- Önce Level 2'yi deploy et, traction gözle, sonra karar

---

## Şu anki durum

✅ Level 1 deployable — `cd site && npm install && npm run dev` çalıştır, dene.
🚧 Level 2 — sıradaki session
🔮 Level 3 — Level 1+2 kullanıcı feedback sonrası karar

Vercel deploy adımları için `site/README.md`.
