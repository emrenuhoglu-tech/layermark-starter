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

3. Repo'yu geçici bir yere klonla:
   git clone https://github.com/emrenuhoglu-tech/layermark-starter
   cd layermark-starter

4. setup_starter.py'i çalıştır — **klasörü bana SORMA, otomatik Masaüstü kullan**. Sadece şu 2 şeyi sor:
   - Kit: 1) AI Asistan  2) İçerik Takip  3) Boş Sayfa
   - Proje adı (kebab-case yap, ör. "satis-bot")

   Komut formati (target'ı sen doldur):
   python setup_starter.py --target=<MASAÜSTÜ-YOLU>

   Diğer soruları default ile geç, cevap için sıkıştırma.

5. Yeni proje klasörüne geç (Masaüstündeki). İçindeki CLAUDE.md'yi oku — üst tarafında <!-- BEGIN: first-run onboarding --> bloğu var, **onu birebir takip et**:
   - Phase 0: TR/EN dilini sor
   - Phase 1-4: 9 soruyu TEK TEK sırala, her cevaptan sonra bir sonrakine geç
   - Soruların altında "Bilmiyor musun?" safety-net cevapları var, kullanıcı atlarsa onları kullan
   - Wizard bittiğinde CLAUDE.md ve README.md'yi cevaplarla doldur, BEGIN/END blok'unu sil

6. Geçici klonlanan layermark-starter klasörünü silebilirsin (artık masaüstündeki yeni proje hazır).

Hadi başla — ilk komut: önkoşul kontrolü.`;

const PROMPT_EN = `Set up a new Claude Code project with layermark-starter. Do these in order:

1. Check prerequisites: git, python (3.10+). If missing, tell me in plain English what to do (Mac: brew install, Windows: give me the download link), wait for me to install. Don't auto-install with apt/brew without asking — confirm with me first.

2. Detect my OS (Mac/Linux/Windows). Resolve my Desktop path:
   - Mac/Linux: $HOME/Desktop
   - Windows: %USERPROFILE%\\Desktop  (or /mnt/c/Users/<me>/Desktop in WSL/Git Bash)

3. Clone the repo into a temp location:
   git clone https://github.com/emrenuhoglu-tech/layermark-starter
   cd layermark-starter

4. Run setup_starter.py — **don't ask me about the target folder, default to Desktop automatically**. Only ask me 2 things:
   - Kit: 1) AI Assistant  2) Content Tracker  3) Blank Slate
   - Project name (kebab-case, e.g. "sales-bot")

   Command (you fill the target):
   python setup_starter.py --target=<DESKTOP-PATH>

   Walk through other questions with sensible defaults; don't pester me.

5. cd into the new project folder (on Desktop). Read its CLAUDE.md — top has a <!-- BEGIN: first-run onboarding --> block. **Follow it exactly**:
   - Phase 0: ask TR/EN language
   - Phase 1-4: ask 9 questions ONE BY ONE, wait for each answer
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
