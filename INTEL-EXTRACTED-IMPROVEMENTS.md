# Starter pack — intel'den çıkan iyileştirmeler

> Source: 75+ YouTube transcript (Pocock 24 + AI Engineer 11 + bugünkü 21 + Anthropic backfill 20). Distillation: 2026-05-04.
> Filter: starter-pack için **somut, uygulanabilir, mevcut yapıdan farklı**. Generic AI haberi değil.

15 item, 4 kategoriye ayrılmış. Her biri inner-loop test'i geçer.

---

## ⚡ Hemen uygulanabilir (bu hafta)

### 1. 30-sn Loom screencast (BOOTSTRAP UX) — 🔥 EN YÜKSEK ROI
- **Source:** Cursor `6Nru5OQq9O4` (verification-by-artifact pattern) + mevcut `SCREENCAST.md`
- **Item:** SCREENCAST.md placeholder var, video yok. Cursor demoları kanıtladı: agent + verification-video = trust. README'nin %0.1 conversion'u → vidyo eklediğinde %5 hedeflenir.
- **Aksiyon:** Loom kayıt + site Hero + README üst.

### 2. Site JSON-LD schema + last-updated (SITE SEO)
- **Source:** Neil Patel `z9WbRkiRQtc` + 2026-05-04-insights.md
- **Item:** AI agents (ChatGPT shopping, Perplexity) artık schema + freshness signal okuyor. Footer'a: `<script type="application/ld+json">` SoftwareApplication tipinde + "Last updated: 2026-05-04" timestamp + ARIA-friendly heading hierarchy.
- **Aksiyon:** Düşük effort, agent-discoverability bonus.

### 3. Wizard yeni soru: "Single vs multi-agent?" (WIZARD QUESTION)
- **Source:** Sandipan AI Engineer + casino bot doctrine
- **Item:** Kit seçiminden ÖNCE: *"Tek ajan mı yoksa birden çok ajan birlikte mi çalışacak?"* → multi-agent ise `orchestrator-safety.md` referansı; single ise hide.
- **Aksiyon:** `CLAUDE.md.tmpl` Phase 0.5 olarak ekle.

### 4. Yeni doctrine D13 — Hooks > CLAUDE.md (NEW DOCTRINE)
- **Source:** Pocock `3CSi8QAoN-s` (hooks vs prompt negatives)
- **Item:** *"Never run npm"* CLAUDE.md'de instruction budget yer; deterministik kuralları **hook**'a taşı (`pre-tool-use` hook + bash `exit 2` ile reject). Hooks enforced, prompts probabilistic.
- **Aksiyon:** CLAUDE.md.tmpl 14. doktrin (zaten var "Hooks > prompt negatives" — bunu netleştir, örnek ekle).

---

## 🎯 Yüksek leverage (1-2 hafta)

### 5. Yeni skill: `ubiquitous-language.md` (NEW SKILL)
- **Source:** Pocock `hX7yG1KVYhI` (DDD ubiquitous language)
- **Item:** Domain glossary — her grilling session sonrası hem human hem LLM glossary güncellenir. Aynı concept'i tekrar grill etmemek için. Frequency: weekly per project.
- **Inner-loop test:** ✅ 2-3x/hafta + aynı pattern + preloaded context büyük yardım eder.
- **Aksiyon:** `template/.claude/skills/ubiquitous-language.md` ekle, glossary template + maintenance instructions.

### 6. Yeni skill: `failing-test-as-prompt.md` (NEW SKILL)
- **Source:** Ryan harness engineering `am_oeAoUhew`
- **Item:** Test/lint çıktısı = ajan'a JIT context injection. Örn: "file > 350 lines = fail" testi yaz, lint output otomatik prompt olur, system-prompt budget yanmaz. `spagetti-check.md` (mevcut) sadece DETECTION; bu skill ENFORCEMENT.
- **Aksiyon:** Test pattern'leri + örnek lint script şablonu.

### 7. Yeni doctrine D14 — Orchestrator-only multi-agent (NEW DOCTRINE, optional)
- **Source:** Sandipan `2czYyrTzILg` + casino bot CLAUDE.md (zaten orada var)
- **Item:** Multi-agent yapacak kullanıcılar için: ajanlar birbirini çağırmaz, orchestrator owns state, immutable+versioned events, data contracts at handoffs, circuit breaker, saga compensation. **Default doctrine değil** — opsiyonel variant: kullanıcı multi-agent dediğinde aktive olur.
- **Aksiyon:** `template/.claude/agents/orchestrator-safety.md` ekle (vendored doc, multi-agent users için).

### 8. Hero re-positioning: "Doctrine, not templates"
- **Source:** Cursor agent-as-computer + Pocock distill thesis
- **Item:** Mevcut hero: *"1 dakikalık kurulum şablonu"*. Yeniden çerçeve: *"The only Claude Code starter with **distributed-systems doctrine pre-shipped**. Orchestrator pattern. Immutable state. Verified agent output. No more 'my agents hallucinated a contract.'"* — fear-of-missing-out on multi-agent safety.
- **Aksiyon:** Site hero copy + README opening line revize.

### 9. Doctrine refinement — Memento vs Suspend/Resume ilişkisi
- **Source:** Pocock + mevcut suspend.md/resume.md
- **Item:** Bir cümle ekle: *"Memento = mental model (yeni işe gelmiş kişi gibi davran). Suspend/Resume = implementation (session sınırında context checkpoint). Together: grill → suspend → next session resume + suspend okur, LLM kaldığın yeri bilir."*
- **Aksiyon:** CLAUDE.md.tmpl Memento doctrine altına ekle.

---

## 📦 Lansman sonrası (kits + marketing)

### 10. Site sayfası: "/docs/doctrines" — 14 Doktrin Açıklaması (SITE CONTENT)
- **Source:** Neil Patel chunk-content + Semrush AI-search-first SEO
- **Item:** Her doktrin için 1 paragraf, standalone sayfa. AI search engines (Perplexity, ChatGPT search) "Claude Code doctrine nedir?" sorgusuna bunu döndürür. LLM-search ranking için chunk-friendly.
- **Aksiyon:** `site/app/docs/page.tsx` veya markdown + Next.js MDX.

### 11. Premium kit lansmanında Reddit niche outreach (PREMIUM KIT TACTIC)
- **Source:** Matt Diggity `f03ZfdtkMzk` (AI search citation playbook)
- **Item:** İlk kit (E-ticaret) lansmanı sonrası: r/ecommerce, r/shopify nişlerinde 7-14 gün lurk + scannable comment'ler 6 archetype ile (straight shooter / missing piece / story drop / proof point / mini playbook / brand voice). Long-tail SEO + AI search citation.
- **Aksiyon:** Lansman playbook'unun bir parçası, **şimdi yapma** (kit yok henüz).

---

## 🔬 Opsiyonel / high-assurance

### 12. Yeni skill: `agent-approval.md` (NEW SKILL, optional)
- **Source:** Pocock AI SDK 6 + human-in-the-loop `YCrj0E_P6ls`
- **Item:** Destructive call'lar (withdraw bet, refund, state mutation) önce `needsApproval: true` flag → user UI onayı. Compliance-critical sistemler için.
- **Aksiyon:** Pre-ship etme (inner-loop fail çoğu user için), ama doctrine doc'unda referans göster.

### 13. Yeni skill: `verify-agent-output.md` (NEW SKILL, optional)
- **Source:** Cursor verification-by-artifact + casino bot CLAUDE.md (zaten ekledik)
- **Item:** Ajan iddiada bulunduğunda: screenshot/video/test çıktısı zorunlu. *"Show, don't tell."* `failing-test-as-prompt.md` ile complementer.
- **Aksiyon:** Optional skill; default'ta açma.

### 14. Wizard sandbox security gate (WIZARD QUESTION, optional)
- **Source:** Harshil Cloudflare `AHtGAgQ0Q_Q`
- **Item:** *"LLM-generated kod çalıştıracak mısın? (untrusted code)"* → evet ise: capability-based security checklist (globalOutbound: null, secret proxy, per-user isolation, max lifetime, audit logs). Misconfig prevention.
- **Aksiyon:** Phase 3 wizard sorusuna ekle (hangi servisler kullanacak'tan sonra).

### 15. Yeni doctrine D16 — "Use Your Search Tool" (NEW DOCTRINE)
- **Source:** Pocock `9VNG0h4pLh0` (extrinsic hallucination)
- **Item:** Pakaj adları, API schema, third-party docs için: *"Use your search tool before guessing."* 4 kelime, supply-chain attack (hallucinated npm) önleme — büyük ROI.
- **Aksiyon:** CLAUDE.md.tmpl prompt-engineer/skill örneklerinde göster.

---

## 📊 Anti-improvements — eklemeyelim

- ❌ Project Glasswing / Claude Mythus referansları — yaz 2026 timeline'ı, henüz shipped değil. Pre-ship doctrine = fragile.
- ❌ Cosmos DB / Robots.txt / generic SEO yazılar — starter audience değil.
- ❌ "AI Asistan kit'e Reddit autoresponder ekleyelim" — kit içeriği henüz placeholder, validation gating'i bozma.

---

## Implementation sırası (önerilen)

| Hafta | İşler | Süre |
|---|---|---|
| **Şimdi** | #1 (Loom), #2 (JSON-LD), #3 (wizard Q), #4 (D13 netleştir) | 2-3 saat |
| **Hafta 2** | #5 (ubiquitous-language), #6 (failing-test), #8 (hero), #9 (Memento) | 4-5 saat |
| **Hafta 3+** | #7 (orchestrator-safety doc), #10 (doctrines page) | 3-4 saat |
| **Lansman sonrası** | #11 (Reddit), #12-14 (optional skills) | TBD |

**Toplam aktif iş:** ~8-10 saat (10 item, validation gating'i bozmadan)

**Kalan 5 item:** opsiyonel, validation/feedback'e göre karar.

---

## Sıradaki adım

User review → öncelik onayı → starter repo'ya implement.

**Validation-first reminder:** Bu öneriler intel'den geldi, gerçek user feedback değil. Yücel'in feedback'i öncelik sırasını değiştirebilir. Önce Yücel test, sonra implement.
