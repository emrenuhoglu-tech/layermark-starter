'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useT, LangToggle } from '../i18n';

const REPO = 'https://github.com/emrenuhoglu-tech/layermark-starter';
const USE_TEMPLATE = `${REPO}/generate`;
const SCRIPT_SOURCE_WIN = `${REPO}/blob/main/site/public/start.cmd`;
const SCRIPT_SOURCE_MAC = `${REPO}/blob/main/site/public/start.command`;

type OS = 'win' | 'mac' | 'linux' | 'unknown';
type Lane = 'easy' | 'manual' | 'dev';

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
  const [lane, setLane] = useState<Lane>('easy');
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

        {/* Lane selector */}
        <div className="grid grid-cols-3 gap-2 mb-8 text-sm">
          <LaneButton active={lane === 'easy'} onClick={() => setLane('easy')} label={t('start.lane.easy')} sub={t('start.lane.easy.sub')} />
          <LaneButton active={lane === 'manual'} onClick={() => setLane('manual')} label={t('start.lane.manual')} sub={t('start.lane.manual.sub')} />
          <LaneButton active={lane === 'dev'} onClick={() => setLane('dev')} label={t('start.lane.dev')} sub={t('start.lane.dev.sub')} />
        </div>

        <div className="border-2 border-accent rounded-xl p-8 bg-surface mb-8 min-h-[260px]">
          {lane === 'easy' && (
            <>
              {os === 'win' && <WindowsBlock />}
              {os === 'mac' && <MacBlock />}
              {os === 'linux' && <LinuxBlock />}
              {os === 'unknown' && <UnknownBlock />}
              <details className="mt-6 text-sm">
                <summary className="cursor-pointer text-muted hover:text-text">{t('start.transparency.title')}</summary>
                <div className="mt-4 text-sm text-muted leading-relaxed space-y-3">
                  <p>{t('start.transparency.intro')}</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>{t('start.transparency.s1')}</li>
                    <li>{t('start.transparency.s2')}</li>
                    <li>{t('start.transparency.s3')}</li>
                    <li>{t('start.transparency.s4')}</li>
                    <li>{t('start.transparency.s5')}</li>
                  </ol>
                  <p>
                    {t('start.transparency.source')}{' '}
                    <a href={SCRIPT_SOURCE_WIN} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      start.cmd
                    </a>
                    {' / '}
                    <a href={SCRIPT_SOURCE_MAC} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      start.command
                    </a>
                  </p>
                </div>
              </details>
            </>
          )}
          {lane === 'manual' && <ManualBlock os={os} />}
          {lane === 'dev' && <DevBlock os={os} />}
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-6">{t('start.next.title')}</h2>
          <ol className="space-y-4">
            <NextStep n="1" t={t('start.next.s1.t')} d={t('start.next.s1.d')} />
            <NextStep n="2" t={t('start.next.s2.t')} d={t('start.next.s2.d')} />
            <NextStep n="3" t={t('start.next.s3.t')} d={t('start.next.s3.d')} />
            <NextStep n="4" t={t('start.next.s4.t')} d={t('start.next.s4.d')} />
            <NextStep n="5" t={t('start.next.s5.t')} d={t('start.next.s5.d')} />
          </ol>
          <div className="mt-6 p-4 border border-yellow-500/30 bg-yellow-500/5 rounded-lg text-sm text-muted">
            <strong className="text-text">⚠ {t('start.warning.title')}:</strong> {t('start.warning.desc')}
          </div>
        </div>

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

function LaneButton({ active, onClick, label, sub }: { active: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border transition text-left ${
        active ? 'border-accent bg-surface text-text' : 'border-border bg-bg text-muted hover:border-text/40'
      }`}
    >
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs mt-1 opacity-80">{sub}</div>
    </button>
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
        className="bg-accent hover:bg-orange-500 text-bg font-semibold px-6 py-3 rounded-lg transition"
      >
        {t('start.mac.copy')}
      </button>
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

function ManualBlock({ os }: { os: OS }) {
  const { t } = useT();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const winSteps = [
    { k: 'win-py', label: 'Python kontrol', cmd: 'python --version' },
    { k: 'win-node', label: 'Node.js kontrol', cmd: 'node --version' },
    { k: 'win-claude-install', label: 'Claude Code CLI kur', cmd: 'npm install -g @anthropic-ai/claude-code' },
    { k: 'win-clone', label: 'Starter çek', cmd: `git clone https://github.com/emrenuhoglu-tech/layermark-starter\ncd layermark-starter` },
    { k: 'win-setup', label: 'Setup çalıştır', cmd: 'python setup_starter.py' },
    { k: 'win-go', label: 'Yeni projeye gir + Claude aç', cmd: `cd ..\\<yeni-proje-adı>\nclaude` },
    { k: 'win-wiz', label: "Claude'da wizard'ı tetikle", cmd: 'merhaba' },
  ];
  const macSteps = [
    { k: 'mac-py', label: 'Python kontrol', cmd: 'python3 --version' },
    { k: 'mac-node', label: 'Node.js kontrol', cmd: 'node --version' },
    { k: 'mac-claude-install', label: 'Claude Code CLI kur', cmd: 'npm install -g @anthropic-ai/claude-code' },
    { k: 'mac-clone', label: 'Starter çek', cmd: `git clone https://github.com/emrenuhoglu-tech/layermark-starter\ncd layermark-starter` },
    { k: 'mac-setup', label: 'Setup çalıştır', cmd: 'python3 setup_starter.py' },
    { k: 'mac-go', label: 'Yeni projeye gir + Claude aç', cmd: `cd ../<yeni-proje-adı>\nclaude` },
    { k: 'mac-wiz', label: "Claude'da wizard'ı tetikle", cmd: 'merhaba' },
  ];

  const steps = os === 'win' ? winSteps : macSteps;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{t('start.manual.title')}</h2>
      <p className="text-sm text-muted mb-6">{t('start.manual.intro')}</p>
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={s.k} className="border border-border rounded-lg p-4 bg-bg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">
                <span className="text-accent font-mono">{i + 1}.</span> {s.label}
              </div>
              <button
                onClick={() => copy(s.k, s.cmd)}
                className="text-xs text-muted hover:text-accent transition"
              >
                {copied === s.k ? '✓ ' + t('start.manual.copied') : t('start.manual.copy')}
              </button>
            </div>
            <pre className="font-mono text-xs bg-surface border border-border rounded p-3 overflow-x-auto whitespace-pre">{s.cmd}</pre>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted mt-4">{t('start.manual.note')}</p>
    </div>
  );
}

function DevBlock({ os }: { os: OS }) {
  const { t } = useT();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('start.dev.title')}</h2>
      <p className="text-sm text-muted mb-6">{t('start.dev.intro')}</p>
      <div className="space-y-6">
        <AltOption
          title={t('start.dev.win')}
          code={`iwr -useb https://emrenuhoglu-tech.github.io/layermark-starter/start.cmd -OutFile s.cmd; .\\s.cmd`}
        />
        <AltOption
          title={t('start.dev.mac')}
          code={`curl -fsSL https://emrenuhoglu-tech.github.io/layermark-starter/start.command | bash`}
        />
        <AltOption
          title={t('start.dev.git')}
          code={`git clone ${REPO}\ncd layermark-starter\npython setup_starter.py`}
        />
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
