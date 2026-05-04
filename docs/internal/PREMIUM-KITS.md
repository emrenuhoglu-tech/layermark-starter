# Premium Kits — Spec Placeholders

> **Status:** Waitlist sinyali aktif. **Hiçbir kit henüz inşa edilmedi.** Bu doc, *eğer* yeterli niyet sinyali (≥20 waitlist kayıt / kit) gelirse ne içereceğinin taslağıdır.

## Doctrine — niye böyle yapıyoruz

- **Validation-first:** Sıfır inşa, sıfır söz. Önce niyet sinyali (Discussions kayıt), sonra plan, sonra inşa.
- **Pocock inner-loop test:** Kit içeriği "günde 2-3x kullanılır mı?" sorusuna evet vermeli. Kit ≠ doc dump; kit = pratik.
- **Surgical scope:** Her kit ≤6 dosya. Daha büyükse "ürün" değil "kurs" olmuştur, kapsam dışı.
- **Lifetime updates included:** Bir kez al, doctrine evolved oldukça update'ler ücretsiz.

## Pricing tasarımı

| Kit | Tahmini fiyat | Niye böyle |
|---|---|---|
| Tek kit | $29 one-time | Anchor — ucuz değil, "kit alacaksın" sinyali |
| 2-kit bundle | $49 | %20 indirim — multi-niche developer'a |
| Tüm kit'ler (4) | $89 | %25 indirim — agency veya power-user için |

**Refund:** 14-gün koşulsuz. Çünkü kanıt yok, müşteri risk almıyor.

---

## Kit 1 — 🛒 E-ticaret

**Hedef kullanıcı:** Türkiye'deki Shopify / WooCommerce / Trendyol satıcıları, mağazasını AI ile otomatize etmek isteyen.

**Kit içeriği (taslak):**

| Dosya | Ne yapar |
|---|---|
| `.claude/skills/order-autoresponder.md` | WhatsApp Business API üstünden gelen sipariş sorularına otomatik cevap (kargo durumu, iade, stok) |
| `.claude/skills/iade-akisi.md` | İade talebini parse eder → kargolama etiketi + müşteri mesajı + Shopify refund draft |
| `.claude/skills/stok-uyari.md` | Shopify/Woo API → stok < threshold ise tedarikçi mail draft + slack alert |
| `.claude/agents/musteri-temsilcisi.md` | Subagent — müşteri mesaj loop'unda canlı kalır, eskaltasyon kararı verir |
| `config/sites/trendyol.yaml` | Trendyol seller portal selektörleri (scraping fallback) |
| `02-memory/training/ecommerce-edge-cases.md` | Sık görülen edge case'ler: gecikmiş kargo, yanlış adres, fiyat itirazı |

**Ne yapmaz:** Mağaza tasarımı, ödeme entegrasyonu (Shopify zaten yapıyor), reklam.

**Inner-loop kanıt:** Mevcut e-ticaretçi günde 2-3x WhatsApp/Shopify arası geçiş yapıyor → bu skill'ler her gün tetiklenir.

---

## Kit 2 — 🏢 Ajans

**Hedef kullanıcı:** Freelancer + küçük ajans (2-5 kişi), 5+ client projesini paralel yöneten.

**Kit içeriği (taslak):**

| Dosya | Ne yapar |
|---|---|
| `.claude/skills/client-onboarding.md` | Yeni client → kontrat draft + project repo template + initial CLAUDE.md (her client için ayrı) |
| `.claude/skills/invoice.md` | Hours-tracked CSV → Stripe invoice link + müşteriye hatırlatma maili |
| `.claude/skills/status-update.md` | Haftalık client status email — git commits + Linear/Notion sync özet |
| `.claude/agents/client-pm.md` | Subagent per client (white-label persona, sadece o client'ın CLAUDE.md'sini bilir) |
| `config/clients.yaml` | Multi-client config — TR IP/proxy/domain/contact |
| `templates/client-CLAUDE.md.tmpl` | Her yeni client için skeleton CLAUDE.md (logo, doctrine override, billing) |

**Ne yapmaz:** Reklam, satış (sales agency için ayrı kit gerekir).

**Inner-loop kanıt:** Ajansta her gün ≥1 client touchpoint var. Onboarding + status + invoice = haftalık döngü.

**Premium farkı:** White-label — kendi logon, kendi tonun, "powered by layermark" yok.

---

## Kit 3 — ✍ Content Creator

**Hedef kullanıcı:** Newsletter yazan (Substack/Beehiiv) + YouTube/X paylaşan + SEO blog yazan içerik üreticisi.

**Kit içeriği (taslak):**

| Dosya | Ne yapar |
|---|---|
| `.claude/skills/newsletter-draft.md` | Haftalık tema + 3 ana kaynak → newsletter draft (700-1200 word, CTA, P.S.) |
| `.claude/skills/video-script.md` | Konu + hedef süre → hook + 3 beat + CTA + thumbnail prompt |
| `.claude/skills/seo-pillar.md` | Anahtar kelime + competitor URL → 2K-3K kelime pillar post outline + internal link map |
| `.claude/skills/cross-post.md` | Newsletter çıktısı → X thread (5 tweet) + LinkedIn post + Instagram caption |
| `.claude/agents/editor.md` | Subagent — yazılan içeriği eleştirir (clarity, hook strength, CTA, fact-check) |
| `02-memory/intel/competitor-analysis.md` | Niş'inde 5 competitor — paylaşım frequency, post type, engagement pattern |

**Ne yapmaz:** Video editing, podcast (ayrı bir kit gerekirse). Tasarım (Canva yapıyor).

**Inner-loop kanıt:** Profesyonel içerik üreticisi haftada 5+ post atıyor. Cross-post + SEO + script = her gün skill kullanımı.

---

## Kit 4 — 🚀 SaaS Founder

**Hedef kullanıcı:** İlk SaaS'ını çıkaran solo / 2-kişi takım. Pre-product yıl 1.

**Kit içeriği (taslak):**

| Dosya | Ne yapar |
|---|---|
| `.claude/skills/landing-from-pmf.md` | Hedef kitle + bir cümle pitch → tam landing copy (hero + 3 benefit + 3 anti-objection + FAQ + CTA) |
| `.claude/skills/onboarding-emails.md` | Yeni signup → 5-email drip (welcome + activation + value + case study + upgrade) |
| `.claude/skills/pricing-page.md` | Audience + competitor → 3-tier pricing tasarımı (free/pro/team) + decoy effect |
| `.claude/skills/changelog.md` | Git log + closed Linear ticket → kullanıcı-facing changelog (Substack veya notion update) |
| `.claude/agents/pmf-grill.md` | Subagent — claim'lerini eleştirir, gerçek müşteri sorardan örnek verir, "neden buna inanayım?" soruyor |
| `02-memory/playbooks/launch-checklist.md` | ProductHunt + HN + Twitter launch koreografi (T-7 → T+0 → T+7) |

**Ne yapmaz:** Backend kod (kendi stack'in seninle gelir). Ödeme integration (Stripe doc'u var).

**Inner-loop kanıt:** Solo SaaS founder yıl-1'de günde landing/copy/email touchpoint'i yapıyor. Bu kit her gün açılır.

---

## Trigger criteria — kit'leri ne zaman inşa ederiz?

Her kit için bağımsız tetik:

- ☐ ≥20 Discussions kaydı **o spesifik kit için**
- ☐ ≥5 kişi waitlist'te "şu spesifik problem için lazım" diye somut use-case yazmış
- ☐ Toplam ≥3 user feedback raporu (`feedback.yml` issue) layermark-starter'a olumlu

Üçü tutarsa: kit inşası başlar, 2-3 hafta inşa, paid lansman.

Yoksa: bu doc placeholder kalır, kit yapılmaz, müşteri geri ödeme almıyor (zaten ödememiş).

---

## "Şimdi bunu yapmıyoruz" — niye?

- Sıfır user feedback → niş'lerin gerçek problemi belli değil
- 4 kit = 8-12 hafta iş → boşa harcamak istemeyiz
- Anti-pattern: pre-build = bloat (Pocock + AI Engineer)
- Doğru sıra: niyet → plan → kod → satış. Şu an 1. adımdayız.

Bu doc gelecekte "premium kit'i nasıl yapacağız?" sorusuna cevap. Şu anki rolü: **placeholder + waitlist credibility**.
