# Changelog

Bu dosya layermark-starter'ın kullanıcı-yüzlü değişikliklerini takip eder. Format [Keep a Changelog](https://keepachangelog.com/) + [Semantic Versioning](https://semver.org/) — minor bump = yeni feature, patch = fix, major = breaking.

## [0.6.0] — 2026-05-04

**Persona-test driven hardening.** 9 round end-to-end audit (5 farklı kullanıcı persona + dış-kullanıcı POV + adversarial pen test + CI gate). 16 commit, 1 demo regen, 1 community discussion seed.

### Added
- **10 domain kategori sistemi** — Phase 0.3 wizard sorusu, kategori boilerplate (`02-memory/category/<NN>-<slug>.md`), HIGH-RISK kategoriler (finance, legal) production doctrine docs'u otomatik dahil eder.
- **5 production doctrine doc** (`02-memory/doctrine/`): auto-mode-classifier, brain-hands-decoupling, multi-grader-eval, eval-awareness, red-team-primitive — Anthropic Engineering 2026-05 distillation.
- **`02-memory/orchestrator-safety.md`** — multi-agent saga + circuit-breaker patterns (Phase 0.5 b path için zorunlu).
- **4 yeni skill**: `agent-approval` (high-risk action gate), `verify-agent-output` (independent verification), `ubiquitous-language` (domain glossary), `failing-test-as-prompt` (Pocock harness pattern).
- **CI smoke test** (`.github/workflows/smoke.yml`) — Python 3.10+3.12 matrix, 3 senaryo (assistant+automation / blank+general / assistant+finance HIGH-RISK).
- **Migration rehberi** README'de — eski projelerden 14-skill + kategori sistemine geçiş için somut `awk`+`diff`+`cp` komutları.
- **CHANGELOG.md** (bu dosya).
- **Live demo'yu hero'da link** — `layermark-demo-ai-assistant` repo (her round sonu güncel template ile regenerate ediliyor).
- **Premium kit waitlist seed** — GitHub Discussion #1 (TR + EN).

### Changed
- **Skill sayısı 5 → 14**: `.claude/skills/README.md` decision tree (kategori-bazlı: ilk 10 dk / yeni feature / riskli action / stuck / aylık temizlik / skill yaratma).
- **Wizard 9 → 10 soru**: Phase 0.3 (kategori) eklendi. Hızlı mod 3-4 soru (kategori setup'ta cevaplandıysa atlanır → 3).
- **CLAUDE.md.tmpl 14 → 20 doctrine**: README + /docs/doctrines ile birebir uyumlu sıralama (1-7 çekirdek, 8-14 skill+workflow, 15-20 production opt-in).
- **`prompt-engineer` agent**: "Three-mode" → "Two-mode + always-on security pass". Description tutarlılığı.
- **`project-advisor` skill**: HIGH-RISK kategori farkındalığı (Step 1.5) — finance/legal projeler için spesifik audit hipotezleri (immutable audit log, double-entry, period close, currency precision, agent-approval gate kullanımı, compliance trail).
- **`setup_starter.py` interactive**: kit + isim + **kategori** soruyor (3 ana soru). HIGH-RISK kategori seçince uyarı + production doctrine dahil edileceğini bildiriyor. Confirmation print'e Kit + Kategori satırları.
- **Site `/start` paste-prompt**: tüm flag'lerle (`--yes --kit --name --category --target`), kit/kategori eşleşme tablosu, python3/python platform notu, intel kit Layermark-internal uyarısı.
- **Mobile nav**: hidden md:flex → mobile için minimal nav (Doctrines + GitHub).
- **`tests/smoke_test.py` rewrite**: 3 senaryo, 14 skill listesi, 10 kategori count, 20 doctrine #1-#20, project-advisor finance section, HIGH-RISK kit override doğrulama.

### Fixed
- **TR/Unicode isim slug bug**: `--yes` mode default target `./<name>` → `./<slug>` (macOS HFS+ NFD/NFC + Dropbox sync). `pyproject.toml` + `package.json` `name` field artık slug (PEP 508 + npm naming convention).
- **`/init` kazası recovery**: `--yes` mode klasör dolu mesajı detaylı (mevcut dosya listesi + Doctrine #10 atfı + 3 çözüm seçeneği).
- **`settings.json.example` Claude Code spec ihlali**: `command_windows`/`command_unix` field'ları kaldırıldı (spec'te yok, hook silently fail ediyordu). Tek `command` field, comment guidance.
- **Phase 0.7 trigger**: HIGH-RISK kategori (finance/legal) için de aktif (önceden sadece multi-agent + otonom action durumlarında).
- **Phase 0.3 paste-flow çift soru riski**: setup_starter veya site/start kategoriyi sorduysa wizard atlar, sadece teyit eder.
- **Kit ↔ wizard runtime divergence (multi-agent)**: assistant/intel kit + Phase 0.5 b cevabı → eksik production doctrine docs curl ile fetch edilir.
- **Phase 0.1 fast mode akış listesi**: 0.3'ü dahil et (önceden atlıyordu).
- **README + site/i18n + start prompt + start.cmd/.command + INVITES + VISION**: "9 soru" → "10 soru kategori dahil" tutarlı sayım.
- **README.en.md "Premium kits"** listesi TR ile aynı 4 ficticious kit'e (önceden core kit'leri premium gibi sunuyordu).
- **`feature-request.yml` skill sayım**: "13 skill" → "14 skill".

### Removed
- **`STARTER-PROMPT.md`** (89K, deprecated Round 2'de) — single source of truth = site/start. Tarihsel referans git history'de.
- **`scripts/regen_starter_prompt.py`** + boş `scripts/` klasörü — STARTER-PROMPT'a bağımlıydı, ölü kod.
- **6 internal doc** root'tan `docs/internal/`'a taşındı (INTEL-EXTRACTED, PREMIUM-KITS, VISION-CONTINUOUS, SITE-PLAN, INVITES, SCREENCAST). Root artık temiz: README × 2, LICENSE, check.{cmd,sh}, setup_starter.py, site/, template/, tests/, docs/.

### Internal
- `docs/internal/SITE-PLAN.md`: "Vercel deploy" → "GitHub Pages via .github/workflows/deploy-site.yml" (gerçek deploy tutarlılığı).
- `template/.claude/skills/grill-me.md` ve diğer skill metadata: "the only one" → "one of 14 foundational" (10 inner-loop meta + 4 kategori-driven safety).

---

## [0.5.0] — 2026-05-03 ve öncesi

İlk public sürüm — pre-persona-test baseline. Kategori sistemi yok, 9 skill, STARTER-PROMPT.md root'ta, CI sadece deploy-site, smoke_test.py drift'te. Tarihsel referans için git history'e bak.

[0.6.0]: https://github.com/emrenuhoglu-tech/layermark-starter/compare/v0.5...v0.6
