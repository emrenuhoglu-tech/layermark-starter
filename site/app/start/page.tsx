'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useT, LangToggle } from '../i18n';

const REPO = 'https://github.com/emrenuhoglu-tech/layermark-starter';
const USE_TEMPLATE = `${REPO}/generate`;

type OS = 'win' | 'mac' | 'linux' | 'unknown';

function detectOS(): OS {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'win';
  if (ua.includes('mac')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'unknown';
}

export default function Start() {
  const { t } = useT();
  const [os, setOS] = useState<OS>('unknown');
  useEffect(() => setOS(detectOS()), []);

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
        <h1 className="text-4xl font-bold mb-4">{t('start.title')}</h1>
        <p className="text-muted text-lg mb-12">{t('start.subtitle')}</p>

        <div className="border-2 border-accent rounded-xl p-8 bg-surface mb-8">
          {os === 'win' && <WindowsBlock />}
          {os === 'mac' && <MacBlock />}
          {os === 'linux' && <LinuxBlock />}
          {os === 'unknown' && <UnknownBlock />}
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-6">{t('start.next.title')}</h2>
          <ol className="space-y-4">
            <NextStep n="1" t={t('start.next.s1.t')} d={t('start.next.s1.d')} />
            <NextStep n="2" t={t('start.next.s2.t')} d={t('start.next.s2.d')} />
            <NextStep n="3" t={t('start.next.s3.t')} d={t('start.next.s3.d')} />
            <NextStep n="4" t={t('start.next.s4.t')} d={t('start.next.s4.d')} />
          </ol>
        </div>

        <details className="border border-border rounded-lg p-6 mb-4">
          <summary className="cursor-pointer font-semibold text-sm">{t('start.alt.dev')}</summary>
          <div className="mt-6 space-y-6">
            <AltOption
              title={t('start.alt.dev.win')}
              code={`iwr -useb https://emrenuhoglu-tech.github.io/layermark-starter/start.cmd -OutFile s.cmd; .\\s.cmd`}
            />
            <AltOption
              title={t('start.alt.dev.mac')}
              code={`curl -fsSL https://emrenuhoglu-tech.github.io/layermark-starter/start.command | bash`}
            />
            <AltOption
              title={t('start.alt.dev.git')}
              code={`git clone ${REPO}\ncd layermark-starter\npython setup_starter.py`}
            />
          </div>
        </details>

        <details className="border border-border rounded-lg p-6">
          <summary className="cursor-pointer font-semibold text-sm">{t('start.alt.gh')}</summary>
          <div className="mt-6 text-sm text-muted leading-relaxed mb-4">{t('start.alt.gh.note')}</div>
          <a
            href={USE_TEMPLATE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-border hover:border-text text-text font-medium px-5 py-2.5 rounded-lg transition text-sm"
          >
            {t('start.alt.gh.btn')}
          </a>
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

function WindowsBlock() {
  const { t } = useT();
  return (
    <div>
      <div className="text-xs font-mono text-muted mb-2">{t('start.win.detected')}</div>
      <h2 className="text-2xl font-bold mb-4">{t('start.win.title')}</h2>
      <a
        href="/layermark-starter/start.cmd"
        download="start.cmd"
        className="inline-flex items-center gap-3 bg-accent hover:bg-orange-500 text-bg font-bold px-8 py-4 rounded-lg text-lg transition"
      >
        <span className="text-2xl">📥</span>
        {t('start.win.btn')}
      </a>
      <div className="mt-6 text-sm text-muted leading-relaxed">{t('start.win.note')}</div>
    </div>
  );
}

function MacBlock() {
  const { t } = useT();
  const oneLine = `curl -fsSL https://emrenuhoglu-tech.github.io/layermark-starter/start.command | bash`;
  return (
    <div>
      <div className="text-xs font-mono text-muted mb-2">{t('start.mac.detected')}</div>
      <h2 className="text-2xl font-bold mb-4">{t('start.mac.title')}</h2>
      <p className="text-sm text-muted mb-4">{t('start.mac.intro')}</p>
      <div className="bg-bg border border-border rounded p-4 font-mono text-xs mb-4 overflow-x-auto">
        <code className="text-accent">{oneLine}</code>
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(oneLine)}
        className="bg-accent hover:bg-orange-500 text-bg font-semibold px-6 py-3 rounded-lg transition mb-6"
      >
        {t('start.mac.copy')}
      </button>
      <details className="text-sm">
        <summary className="cursor-pointer text-muted hover:text-text">{t('start.mac.alt')}</summary>
        <div className="mt-4 text-sm text-muted leading-relaxed space-y-2">
          <a
            href="/layermark-starter/start.command"
            download="start.command"
            className="inline-flex items-center gap-2 border border-border hover:border-text text-text font-medium px-5 py-2.5 rounded-lg transition"
          >
            📥 {t('start.mac.alt.btn')}
          </a>
          <p className="mt-3">{t('start.mac.alt.note')}</p>
          <div className="bg-bg border border-border rounded p-3 font-mono text-xs">
            <code className="text-accent">chmod +x ~/Downloads/start.command && ~/Downloads/start.command</code>
          </div>
          <p className="text-xs">{t('start.mac.alt.tip')}</p>
        </div>
      </details>
    </div>
  );
}

function LinuxBlock() {
  const { t } = useT();
  const oneLine = `curl -fsSL https://emrenuhoglu-tech.github.io/layermark-starter/start.command | bash`;
  return (
    <div>
      <div className="text-xs font-mono text-muted mb-2">{t('start.linux.detected')}</div>
      <h2 className="text-2xl font-bold mb-4">{t('start.linux.title')}</h2>
      <p className="text-sm text-muted mb-4">{t('start.linux.intro')}</p>
      <div className="bg-bg border border-border rounded p-4 font-mono text-xs mb-4 overflow-x-auto">
        <code className="text-accent">{oneLine}</code>
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(oneLine)}
        className="bg-accent hover:bg-orange-500 text-bg font-semibold px-6 py-3 rounded-lg transition"
      >
        {t('start.mac.copy')}
      </button>
    </div>
  );
}

function UnknownBlock() {
  const { t } = useT();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('start.unknown.title')}</h2>
      <div className="grid grid-cols-3 gap-4">
        <a
          href="/layermark-starter/start.cmd"
          download="start.cmd"
          className="border border-border rounded-lg p-6 text-center hover:border-accent transition"
        >
          <div className="text-3xl mb-2">🪟</div>
          <div className="font-semibold">Windows</div>
          <div className="text-xs text-muted mt-1">start.cmd</div>
        </a>
        <a
          href="/layermark-starter/start.command"
          download="start.command"
          className="border border-border rounded-lg p-6 text-center hover:border-accent transition"
        >
          <div className="text-3xl mb-2">🍎</div>
          <div className="font-semibold">macOS</div>
          <div className="text-xs text-muted mt-1">start.command</div>
        </a>
        <a
          href="/layermark-starter/start.command"
          download="start.sh"
          className="border border-border rounded-lg p-6 text-center hover:border-accent transition"
        >
          <div className="text-3xl mb-2">🐧</div>
          <div className="font-semibold">Linux</div>
          <div className="text-xs text-muted mt-1">start.sh</div>
        </a>
      </div>
    </div>
  );
}

function NextStep({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <li className="flex gap-4">
      <div className="bg-surface border border-border rounded-full w-8 h-8 flex items-center justify-center font-mono text-sm font-bold text-accent shrink-0">
        {n}
      </div>
      <div>
        <div className="font-semibold mb-1">{t}</div>
        <div className="text-sm text-muted">{d}</div>
      </div>
    </li>
  );
}

function AltOption({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="bg-bg border border-border rounded p-3 font-mono text-xs overflow-x-auto whitespace-pre">
        <code className="text-accent">{code}</code>
      </div>
    </div>
  );
}
