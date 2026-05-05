'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useT, LangToggle, type Lang } from '../i18n';

const REPO = 'https://github.com/emrenuhoglu-tech/layermark-starter';

const PROMPT_TR = `Sen bana layermark-starter ile yeni bir Claude Code projesi kuracaksın. Sırayla yap:

1. Önkoşulları kontrol et: git, python (3.10+). Eksik varsa bana plain-Türkçe ile ne yapacağımı söyle (Mac: brew install, Windows: indirme linki ver), ben kurana kadar bekle. Hiçbir şeyi kendi başına apt/brew ile ZORLA kurma — sen önce sor, ben onaylayınca devam et.

2. OS'umu tespit et (Mac/Linux/Windows). Masaüstü yolumu belirle:
   - Mac/Linux: $HOME/Desktop
   - Windows: %USERPROFILE%\\Desktop  (Git Bash veya WSL ise /mnt/c/Users/<sen>/Desktop)

3. Repo'yu geçici bir yere indir. **ZIP-first strateji** (git clone'dan 5-10x hızlı, protokol overhead yok):

   **Mac/Linux:**
   \`\`\`
   curl -fsSL https://github.com/emrenuhoglu-tech/layermark-starter/archive/refs/heads/main.tar.gz | tar -xz -C /tmp
   cd /tmp/layermark-starter-main
   \`\`\`

   **Windows (PowerShell):**
   \`\`\`
   $zip = "$env:TEMP\\layermark.zip"
   Invoke-WebRequest -Uri "https://github.com/emrenuhoglu-tech/layermark-starter/archive/refs/heads/main.zip" -OutFile $zip
   Expand-Archive $zip -DestinationPath $env:TEMP -Force
   cd "$env:TEMP\\layermark-starter-main"
   \`\`\`

   **Fallback (yalnızca ZIP başarısız olursa):**
   \`\`\`
   git clone --depth 1 https://github.com/emrenuhoglu-tech/layermark-starter
   cd layermark-starter
   \`\`\`
   ZIP genelde 2-5 sn'de biter; \`git clone\` 30 sn-2 dk sürebiliyor (protocol handshake + pack negotiation). ZIP fail ederse git clone'a geç.

   **İndirme bitene kadar (2-30 sn) kullanıcıya birebir bu tanıtım metnini göster** (kullanıcının seçtiği dile göre TR ya da EN; önce dili sor — adım 0):

   \`\`\`
   👋 Hoş geldin! Klonlama bitene kadar kısa tanıtım:

   Layermark Starter sana şunları kuruyor:
   - 📂 CLAUDE.md — Claude'un her session'da okuyacağı "projem nasıl çalışır" rehberi
   - 🛠 15 hazır skill — /grill-me, /verify-agent-output, /agent-approval, /suspend, /resume...
   - 🤖 prompt-engineer asistanı — günlük dilini düzgün prompt'a çevirir + projeyi denetler
   - 📚 20 doctrine — Pocock + AI Engineer + Anthropic eğitiminden damıtılmış kurallar
   - 🎯 10 kategori şablonu — finans/hukuk gibi yüksek-riskli alanlarda otomatik ek korumalar
   - 🪝 2 hook + ayar — her edit'i hatırlar, her session sonu özet bırakır

   💡 Asistan ne zaman uyanır?
      Wizard tamamlandıktan SONRA → "yap/ekle/kur" tarzı her isteğinde
      prompt'unu düzenler; "kontrol et" dediğinde projeyi denetler.
      Hassasiyetini birazdan Phase 0.6'da seçeceksin.

   Az sonra birkaç soru gelecek: proje adı, alan kategorisi, asistan modu.
   \`\`\`

   EN versiyonu kullanıcı EN seçtiyse:
   \`\`\`
   👋 Welcome! Quick intro while the clone finishes:

   Layermark Starter installs for you:
   - 📂 CLAUDE.md — guide Claude reads at every session ("how my project works")
   - 🛠 15 ready-to-use skills — /grill-me, /verify-agent-output, /agent-approval, /suspend...
   - 🤖 prompt-engineer agent — turns casual requests into clean prompts + audits the project
   - 📚 20 doctrines — distilled from Pocock + AI Engineer + Anthropic Engineering trainings
   - 🎯 10 category packs — finance/legal etc. HIGH-RISK areas get extra safety automatically
   - 🪝 2 hooks + config — remembers every edit, snapshots each session end

   💡 When does the assistant wake up?
      AFTER the wizard finishes → on every "do/add/build" request it refines
      your prompt; on "check/review" it audits the project. You'll pick its
      sensitivity in Phase 0.6 of the wizard.

   In a moment a few questions: project name, category, assistant mode.
   \`\`\`

4. setup_starter.py'i çalıştır — **klasörü bana SORMA, otomatik Masaüstü kullan**. Sırayla şu 4 şeyi sor (DİL HER ŞEYDEN ÖNCE):
   - **(0) Dil / Language**: "Türkçe (1) yoksa English (2)?" — bu cevabı tüm sonraki yazışmada kullan; TR seçtiyse devamı TR, EN seçtiyse devamı EN.
   - Proje adı (küçük harf, kelimeleri tireyle bağla — ör. "musteri-asistani" veya "fatura-otomasyon")
   - Domain kategori: 1) Otomasyon  2) İçerik & medya  3) Yazılım & ürün  4) Oyun  5) Veri & analiz  6) Finans/audit ⚠HIGH RISK  7) Hukuk/uyumluluk ⚠HIGH RISK  8) Pazarlama  9) Eğitim  10) Kişisel  -) genel
     - Kategori 6 veya 7 seçilirse: production doctrine (auto-mode classifier, red-team, multi-grader eval) otomatik kopyalanır, kullanıcıya bunu bildir.
   - **Phase 0.6 — yardımcı asistan ne sıklıkla devreye girsin?** (default: b)
     - Asistan iki iş yapıyor: (1) günlük dilde yazdığın isteği düzenli prompt'a çevirir, (2) "kontrol et" dediğinde projeyi denetler. Ek olarak her seferinde gizli anahtar/güvenlik taraması yapar.
     - (a) HER MESAJDA — "yap/ekle/kur" tarzı her isteğinde devreye girer (her mesajda 1-2 sn bekleme, en yüksek kalite)
     - (b) İŞ-BAZLI (default) — yeni iş başlatırken + "kontrol et" derken devreye girer (çoğu kullanıcı için doğru denge)
     - (c) MANUAL — sen "asistana sor" / "denetle" diyene kadar uyumaz
     - (d) KAPALI — asistan dosyası kurulmaz, hiç olmaz
     - **Demo göster:** "slack botu kur" gibi günlük örnek için her seçimde ne olacağını 4 satırla anlat, kullanıcı bilerek seçsin. "BUILD modu / AUDIT modu" gibi terim kullanma — "düzgün prompt üretir" / "projeyi denetler" gibi günlük dil kullan.
     - Sonradan değiştirmek için: CLAUDE.md \`## Yardımcı asistan modu\` bölümünden + .claude/agents/prompt-engineer.md \`description:\` satırından (4 tanım inline).

   Komut formatı (--kit=blank default, ayrıca sormaya gerek yok — tek satır):
   python3 setup_starter.py --yes --name=<PROJE-ADI> --kit=blank --category=<KATEGORI-KEY> --prompt-engineer-mode=<MODE-KEY> --target=<MASAÜSTÜ-YOLU>/<PROJE-ADI>

   (macOS/Linux'ta python3, Windows'ta python — Windows'ta direkt python kullan, python3 alias'ı yok.)

   **Kategori-key eşleşmesi**: 1='automation', 2='content', 3='product', 4='game', 5='data', 6='finance', 7='legal', 8='marketing', 9='education', 10='personal', -='general'
   **Mode-key eşleşmesi**: a='aggressive', b='match', c='manual', d='off'

   **Not:** Eski "AI Asistan / İçerik Takip / Boş Sayfa" 3-kit seçimi kaldırıldı. Default (\`--kit=blank\`) tüm kullanıcılar için tek yol. Wizard kategoriye göre kalibre eder.

5. Yeni proje klasörüne geç (Masaüstündeki). İçindeki CLAUDE.md'yi oku — üst tarafında <!-- BEGIN: first-run onboarding --> bloğu var, **onu birebir takip et**:
   - Phase 0: TR/EN dilini sor
   - Phase 0.3 zaten setup'ta sorduğumuz için kategori cevabını taşı, tekrarlama
   - Phase 1-4: 9 numbered soruyu TEK TEK sırala (toplam: 1 dil + 1 kategori + 9 = 11 etkileşim, kullanıcıya "10 soru civarı" de)
   - Soruların altında "Bilmiyor musun?" safety-net cevapları var, kullanıcı atlarsa onları kullan
   - Wizard bittiğinde CLAUDE.md ve README.md'yi cevaplarla doldur, BEGIN/END blok'unu sil

6. Geçici klonlanan layermark-starter klasörünü silebilirsin (artık masaüstündeki yeni proje hazır).

Hadi başla — ilk komut: önkoşul kontrolü.`;

const PROMPT_EN = `Set up a new Claude Code project with layermark-starter. Do these in order:

1. Check prerequisites: git, python (3.10+). If missing, tell me in plain English what to do (Mac: brew install, Windows: give me the download link), wait for me to install. Don't auto-install with apt/brew without asking — confirm with me first.

2. Detect my OS (Mac/Linux/Windows). Resolve my Desktop path:
   - Mac/Linux: $HOME/Desktop
   - Windows: %USERPROFILE%\\Desktop  (or /mnt/c/Users/<me>/Desktop in WSL/Git Bash)

3. Download the repo into a temp location. **ZIP-first strategy** (5-10x faster than git clone, no protocol overhead):

   **Mac/Linux:**
   \`\`\`
   curl -fsSL https://github.com/emrenuhoglu-tech/layermark-starter/archive/refs/heads/main.tar.gz | tar -xz -C /tmp
   cd /tmp/layermark-starter-main
   \`\`\`

   **Windows (PowerShell):**
   \`\`\`
   $zip = "$env:TEMP\\layermark.zip"
   Invoke-WebRequest -Uri "https://github.com/emrenuhoglu-tech/layermark-starter/archive/refs/heads/main.zip" -OutFile $zip
   Expand-Archive $zip -DestinationPath $env:TEMP -Force
   cd "$env:TEMP\\layermark-starter-main"
   \`\`\`

   **Fallback (only if ZIP fails):**
   \`\`\`
   git clone --depth 1 https://github.com/emrenuhoglu-tech/layermark-starter
   cd layermark-starter
   \`\`\`
   ZIP usually completes in 2-5s; \`git clone\` can take 30s-2min (protocol handshake + pack negotiation). Switch to git only if ZIP fails.

   **While the download runs (2-30s), show this exact intro to the user** (in their chosen language; ask language first — step 0):

   \`\`\`
   👋 Welcome! Quick intro while the clone finishes:

   Layermark Starter installs for you:
   - 📂 CLAUDE.md — guide Claude reads at every session ("how my project works")
   - 🛠 15 ready-to-use skills — /grill-me, /verify-agent-output, /agent-approval, /suspend...
   - 🤖 prompt-engineer agent — turns casual requests into clean prompts + audits the project
   - 📚 20 doctrines — distilled from Pocock + AI Engineer + Anthropic Engineering trainings
   - 🎯 10 category packs — finance/legal etc. HIGH-RISK areas get extra safety automatically
   - 🪝 2 hooks + config — remembers every edit, snapshots each session end

   💡 When does the assistant wake up?
      AFTER the wizard finishes → on every "do/add/build" request it refines
      your prompt; on "check/review" it audits the project. You'll pick its
      sensitivity in Phase 0.6 of the wizard.

   In a moment a few questions: project name, category, assistant mode.
   \`\`\`

   TR version if the user picked TR:
   \`\`\`
   👋 Hoş geldin! Klonlama bitene kadar kısa tanıtım:

   Layermark Starter sana şunları kuruyor:
   - 📂 CLAUDE.md — Claude'un her session'da okuyacağı "projem nasıl çalışır" rehberi
   - 🛠 15 hazır skill — /grill-me, /verify-agent-output, /agent-approval, /suspend, /resume...
   - 🤖 prompt-engineer asistanı — günlük dilini düzgün prompt'a çevirir + projeyi denetler
   - 📚 20 doctrine — Pocock + AI Engineer + Anthropic eğitiminden damıtılmış kurallar
   - 🎯 10 kategori şablonu — finans/hukuk gibi yüksek-riskli alanlarda otomatik ek korumalar
   - 🪝 2 hook + ayar — her edit'i hatırlar, her session sonu özet bırakır

   💡 Asistan ne zaman uyanır?
      Wizard tamamlandıktan SONRA → "yap/ekle/kur" tarzı her isteğinde
      prompt'unu düzenler; "kontrol et" dediğinde projeyi denetler.
      Hassasiyetini birazdan Phase 0.6'da seçeceksin.

   Az sonra birkaç soru gelecek: proje adı, alan kategorisi, asistan modu.
   \`\`\`

4. Run setup_starter.py — **don't ask me about the target folder, default to Desktop automatically**. Ask 4 things in order (LANGUAGE FIRST):
   - **(0) Language / Dil**: "Türkçe (1) or English (2)?" — use this answer in ALL subsequent prose; TR for Turkish, EN for English.
   - Project name (lowercase, words joined with hyphens — e.g. "customer-assistant" or "invoice-tracker")
   - Domain category: 1) Automation  2) Content & media  3) Software & product  4) Game dev  5) Data & analysis  6) Finance/audit ⚠HIGH RISK  7) Legal/compliance ⚠HIGH RISK  8) Marketing  9) Education  10) Personal  -) general
     - If category 6 or 7 is picked: production doctrine docs (auto-mode classifier, red-team, multi-grader eval) auto-copy. Tell the user.
   - **Phase 0.6 — how often should the helper assistant kick in?** (default: b)
     - The assistant does 2 things: (1) turns your casual request into a clean prompt, (2) audits the project when you say "check / review". Plus a secrets/security pass every time.
     - (a) EVERY MESSAGE — kicks in on every "do/add/build" request (1-2s wait per message, highest quality)
     - (b) JOB-BASED (default) — wakes up at start of new work + when you say "check/review" (right balance for most users)
     - (c) MANUAL — silent until you say "ask the assistant" / "audit"
     - (d) OFF — assistant file isn't installed at all
     - **Show demo:** for an example like "build a slack bot", explain in 4 lines what happens in each mode so the user picks based on info. Don't use jargon like "BUILD mode / AUDIT mode" — say "produces a clean prompt" / "audits the project" in plain English.
     - To change later: \`## Yardımcı asistan modu\` section in CLAUDE.md + the \`description:\` line in .claude/agents/prompt-engineer.md (4 templates inline).

   Command format (--kit=blank is the default for everyone — single line):
   python3 setup_starter.py --yes --name=<PROJECT-NAME> --kit=blank --category=<CATEGORY-KEY> --prompt-engineer-mode=<MODE-KEY> --target=<DESKTOP-PATH>/<PROJECT-NAME>

   (Use python3 on macOS/Linux; on Windows use python directly — there's no python3 alias.)

   **Category-key mapping**: 1='automation', 2='content', 3='product', 4='game', 5='data', 6='finance', 7='legal', 8='marketing', 9='education', 10='personal', -='general'
   **Mode-key mapping**: a='aggressive', b='match', c='manual', d='off'

   **Note:** The old "AI Assistant / Content Tracker / Blank Slate" 3-kit selection has been removed. Default (\`--kit=blank\`) is the single path for everyone. The wizard calibrates based on category.

5. cd into the new project folder (on Desktop). Read its CLAUDE.md — top has a <!-- BEGIN: first-run onboarding --> block. **Follow it exactly**:
   - Phase 0: ask TR/EN language
   - Phase 0.3 was already answered during setup — carry the category answer forward, don't re-ask
   - Phase 1-4: ask the 9 numbered questions ONE BY ONE (total: 1 lang + 1 category + 9 = 11 prompts, tell the user "about 10 questions")
   - Each question has a "Don't know?" safety-net answer; if I skip, use that
   - When wizard completes, fill CLAUDE.md and README.md with my answers, then delete the BEGIN/END block

6. Delete the temporarily-cloned layermark-starter folder (the new project on Desktop is what matters now).

Start now — first task: prerequisite check.`;

export default function Start() {
  const { t, lang } = useT();
  const [copied, setCopied] = useState(false);

  const prompt = lang === 'en' ? PROMPT_EN : PROMPT_TR;

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-sm hover:text-accent">
            ◂ layermark-starter
          </Link>
          <div className="flex items-center gap-6">
            <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-text">
              GitHub
            </a>
            <LangToggle />
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-xs font-mono text-accent mb-4">{t('start.step')}</div>
        <h1 className="text-4xl font-bold mb-4">{t('start.v2.title')}</h1>
        <p className="text-muted text-lg mb-8">{t('start.v2.subtitle')}</p>

        {/* Prereq check */}
        <div className="border border-border rounded-xl p-6 bg-surface mb-6">
          <h2 className="text-sm font-semibold mb-3 text-muted">{t('start.v2.prereq.title')}</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-accent">✓</span>
              <div>
                <strong>Claude Code</strong> — {t('start.v2.prereq.claude.desc')}{' '}
                <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">claude.ai/code</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent">✓</span>
              <div>
                <strong>Git</strong> — {t('start.v2.prereq.git.desc')}{' '}
                <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">git-scm.com</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent">✓</span>
              <div>
                <strong>Python 3.10+</strong> — {t('start.v2.prereq.python.desc')}{' '}
                <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">python.org</a>
              </div>
            </li>
          </ul>
          <p className="text-xs text-muted mt-3 leading-relaxed">{t('start.v2.prereq.hint')}</p>
        </div>

        {/* Step 1: Open Claude Code */}
        <div className="border border-border rounded-xl p-8 bg-surface mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-accent text-bg font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
              1
            </span>
            <h2 className="text-xl font-bold">{t('start.v2.s1.title')}</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-4">{t('start.v2.s1.desc')}</p>
          <div className="text-xs text-muted">
            {t('start.v2.s1.hint')}{' '}
            <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              claude.ai/code
            </a>
          </div>
        </div>

        {/* Value clarifier — what this prompt loads that vanilla doesn't */}
        <div className="border border-accent/40 rounded-xl p-5 bg-accent/5 mb-6">
          <div className="text-xs font-mono text-accent mb-2">{t('start.value.tag')}</div>
          <p className="text-sm leading-relaxed mb-2">
            <strong>{t('start.value.lead')}</strong>
          </p>
          <ul className="text-sm text-muted leading-relaxed space-y-1 ml-4">
            <li>• {t('start.value.b1')}</li>
            <li>• {t('start.value.b2')}</li>
            <li>• {t('start.value.b3')}</li>
            <li>• {t('start.value.b4')}</li>
          </ul>
          <p className="text-xs text-muted mt-3">
            <Link href="/why" className="text-accent hover:underline">{t('start.value.link')}</Link>
          </p>
        </div>

        {/* Step 2: Copy the prompt */}
        <div className="border-2 border-accent rounded-xl p-8 bg-surface mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-accent text-bg font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
              2
            </span>
            <h2 className="text-xl font-bold">{t('start.v2.s2.title')}</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-4">{t('start.v2.s2.desc')}</p>

          <div className="bg-bg border border-border rounded-lg p-4 font-mono text-xs leading-relaxed overflow-auto max-h-80 mb-4 whitespace-pre-wrap">
            {prompt}
          </div>

          <button
            onClick={copy}
            className="bg-accent hover:bg-orange-500 text-bg font-bold px-8 py-4 rounded-lg text-lg transition w-full sm:w-auto"
          >
            {copied ? `✓ ${t('start.v2.copied')}` : `📋 ${t('start.v2.copy')}`}
          </button>
        </div>

        {/* Step 3: Paste */}
        <div className="border border-border rounded-xl p-8 bg-surface mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-accent text-bg font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
              3
            </span>
            <h2 className="text-xl font-bold">{t('start.v2.s3.title')}</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed">{t('start.v2.s3.desc')}</p>
        </div>

        {/* What happens */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-6">{t('start.v2.flow.title')}</h2>
          <ol className="space-y-3 text-sm">
            <FlowItem n="1" text={t('start.v2.flow.f1')} />
            <FlowItem n="2" text={t('start.v2.flow.f2')} />
            <FlowItem n="3" text={t('start.v2.flow.f3')} />
            <FlowItem n="4" text={t('start.v2.flow.f4')} />
            <FlowItem n="5" text={t('start.v2.flow.f5')} />
          </ol>
        </div>

        {/* Alt: Don't have Claude Code */}
        <details className="border border-border rounded-lg p-6 mb-4">
          <summary className="cursor-pointer font-semibold text-sm">{t('start.v2.alt.noclaude')}</summary>
          <div className="mt-4 text-sm text-muted leading-relaxed space-y-2">
            <p>{t('start.v2.alt.noclaude.desc')}</p>
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent hover:bg-orange-500 text-bg font-semibold px-5 py-2.5 rounded-lg transition text-sm mt-2"
            >
              {t('start.v2.alt.noclaude.btn')}
            </a>
          </div>
        </details>

        {/* Alt: Manual / advanced */}
        <details className="border border-border rounded-lg p-6">
          <summary className="cursor-pointer font-semibold text-sm">{t('start.v2.alt.manual')}</summary>
          <div className="mt-4 text-sm text-muted leading-relaxed space-y-3">
            <p>{t('start.v2.alt.manual.desc')}</p>
            <div>
              <div className="text-xs font-semibold mb-1">git clone</div>
              <pre className="bg-bg border border-border rounded p-3 font-mono text-xs whitespace-pre-wrap overflow-x-auto">{`git clone ${REPO}\ncd layermark-starter\npython setup_starter.py`}</pre>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">{t('start.v2.alt.manual.script')}</div>
              <a
                href="/layermark-starter/start.cmd"
                download="start.cmd"
                className="inline-block border border-border hover:border-text text-text px-4 py-2 rounded text-xs mr-2"
              >
                start.cmd (Windows)
              </a>
              <a
                href="/layermark-starter/start.command"
                download="start.command"
                className="inline-block border border-border hover:border-text text-text px-4 py-2 rounded text-xs"
              >
                start.command (Mac/Linux)
              </a>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">{t('start.v2.alt.manual.gh')}</div>
              <a
                href={`${REPO}/generate`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-border hover:border-text text-text px-4 py-2 rounded text-xs"
              >
                {t('start.alt.gh.btn')}
              </a>
            </div>
          </div>
        </details>

        <div className="mt-16 text-center text-xs text-muted">
          {t('start.support.intro')}{' '}
          <a href={`${REPO}/issues/new/choose`} className="underline hover:text-text">
            {t('start.support.issue')}
          </a>{' '}
          {t('start.support.or')}{' '}
          <a href={`${REPO}/discussions`} className="underline hover:text-text">
            {t('start.support.disc')}
          </a>
          .
        </div>
      </section>
    </main>
  );
}

function FlowItem({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="text-accent font-mono shrink-0">{n}.</span>
      <span className="text-muted">{text}</span>
    </li>
  );
}
