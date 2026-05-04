'use client';

import Link from 'next/link';
import TerminalPreview from './TerminalPreview';
import { useT, LangToggle } from './i18n';

const REPO = 'https://github.com/emrenuhoglu-tech/layermark-starter';
const USE_TEMPLATE = `${REPO}/generate`;

export default function Home() {
  const { t } = useT();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="font-mono text-sm">
            <span className="text-accent">▸</span> layermark-starter
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm text-muted">
              <a href="#how" className="hover:text-text">{t('nav.how')}</a>
              <a href="#what" className="hover:text-text">{t('nav.what')}</a>
              <Link href="/docs/doctrines" className="hover:text-text">{t('nav.doctrines')}</Link>
              <a href="#kits" className="hover:text-text">{t('nav.kits')}</a>
              <a href="#categories" className="hover:text-text">{t('nav.categories')}</a>
              <a href="#premium" className="hover:text-text">{t('nav.premium')}</a>
              <a href={REPO} className="hover:text-text" target="_blank" rel="noopener noreferrer">
                {t('nav.github')}
              </a>
            </nav>
            <LangToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="text-xs font-mono text-muted mb-6">{t('hero.tag')}</div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          {t('hero.title.1')}{' '}
          <span className="gradient-text">{t('hero.title.accent')}</span>
          <br />
          {t('hero.title.2')}
        </h1>
        <p className="text-xl text-muted leading-relaxed mb-10 max-w-2xl">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/start"
            className="bg-accent hover:bg-orange-500 text-bg font-semibold px-8 py-4 rounded-lg transition"
          >
            {t('hero.cta.primary')}
          </Link>
          <a
            href={USE_TEMPLATE}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border hover:border-text text-text font-medium px-8 py-4 rounded-lg transition"
          >
            {t('hero.cta.secondary')}
          </a>
        </div>

        <div className="mt-8 text-sm text-muted">{t('hero.microtext')}</div>

        <div className="mt-12">
          <TerminalPreview />
          <div className="text-xs text-muted text-center mt-3 font-mono">{t('preview.caption')}</div>
        </div>
      </section>

      {/* What it ships */}
      <section id="what" className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-3">{t('what.title')}</h2>
          <p className="text-muted mb-12">{t('what.subtitle')}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card title={t('what.card1.title')} desc={t('what.card1.desc')} />
            <Card title={t('what.card2.title')} desc={t('what.card2.desc')} />
            <Card title={t('what.card3.title')} desc={t('what.card3.desc')} />
            <Card title={t('what.card4.title')} desc={t('what.card4.desc')} />
            <Card title={t('what.card5.title')} desc={t('what.card5.desc')} />
            <Card title={t('what.card6.title')} desc={t('what.card6.desc')} />
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12">{t('how.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Step
              n="1"
              title={t('how.s1.title')}
              code={'check.cmd  # Win\nbash check.sh  # Mac'}
              desc={t('how.s1.desc')}
            />
            <Step n="2" title={t('how.s2.title')} code={'python setup_starter.py'} desc={t('how.s2.desc')} />
            <Step n="3" title={t('how.s3.title')} code={'cd <new-project>\nclaude'} desc={t('how.s3.desc')} />
          </div>
        </div>
      </section>

      {/* Kits */}
      <section id="kits" className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12">{t('kits.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Kit emoji="🤖" name={t('kits.k1.name')} desc={t('kits.k1.desc')} defaults={t('kits.k1.def')} />
            <Kit emoji="📊" name={t('kits.k2.name')} desc={t('kits.k2.desc')} defaults={t('kits.k2.def')} />
            <Kit emoji="📝" name={t('kits.k3.name')} desc={t('kits.k3.desc')} defaults={t('kits.k3.def')} />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-xs font-mono text-accent mb-3">{t('categories.tag')}</div>
          <h2 className="text-3xl font-bold mb-4">{t('categories.title')}</h2>
          <p className="text-muted mb-12 max-w-2xl">{t('categories.subtitle')}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
            <CategoryChip emoji="🔁" name={t('categories.c1')} highRisk={false} />
            <CategoryChip emoji="📝" name={t('categories.c2')} highRisk={false} />
            <CategoryChip emoji="💻" name={t('categories.c3')} highRisk={false} />
            <CategoryChip emoji="🎮" name={t('categories.c4')} highRisk={false} />
            <CategoryChip emoji="📊" name={t('categories.c5')} highRisk={false} />
            <CategoryChip emoji="🧮" name={t('categories.c6')} highRisk={true} />
            <CategoryChip emoji="🏛" name={t('categories.c7')} highRisk={true} />
            <CategoryChip emoji="📈" name={t('categories.c8')} highRisk={false} />
            <CategoryChip emoji="🎓" name={t('categories.c9')} highRisk={false} />
            <CategoryChip emoji="🧘" name={t('categories.c10')} highRisk={false} />
          </div>

          <p className="mt-8 text-sm text-muted leading-relaxed">
            <strong className="text-accent">{t('categories.high.tag')}</strong> {t('categories.high.desc')}
          </p>
        </div>
      </section>

      {/* Premium Kits */}
      <section id="premium" className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-xs font-mono text-accent mb-3">{t('premium.tag')}</div>
          <h2 className="text-3xl font-bold mb-3">{t('premium.title')}</h2>
          <p className="text-muted mb-12 max-w-2xl">
            {t('premium.subtitle1')} <strong className="text-text">{t('premium.subtitle2')}</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <PremiumKit emoji="🛒" name={t('premium.k1.name')} desc={t('premium.k1.desc')} for_who={t('premium.k1.for')} />
            <PremiumKit emoji="🏢" name={t('premium.k2.name')} desc={t('premium.k2.desc')} for_who={t('premium.k2.for')} />
            <PremiumKit emoji="✍" name={t('premium.k3.name')} desc={t('premium.k3.desc')} for_who={t('premium.k3.for')} />
            <PremiumKit emoji="🚀" name={t('premium.k4.name')} desc={t('premium.k4.desc')} for_who={t('premium.k4.for')} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/emrenuhoglu-tech/layermark-starter/discussions/new?category=ideas"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent hover:bg-orange-500 text-bg font-semibold px-6 py-3 rounded-lg transition"
            >
              {t('premium.cta')}
            </a>
            <span className="text-sm text-muted">{t('premium.cta.note')}</span>
          </div>
        </div>
      </section>

      {/* Anti-friction */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-3">{t('antif.title')}</h2>
          <ul className="text-muted space-y-2 mb-10">
            <li>• {t('antif.no1')}</li>
            <li>• {t('antif.no2')}</li>
            <li>• {t('antif.no3')}</li>
          </ul>

          <h3 className="text-2xl font-bold mb-3">{t('antif.yes.title')}</h3>
          <ul className="text-muted space-y-2">
            <li>✓ {t('antif.yes1')}</li>
            <li>✓ {t('antif.yes2')}</li>
            <li>✓ {t('antif.yes3')}</li>
            <li>✓ {t('antif.yes4')}</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <div className="flex flex-col gap-1">
            <div>{t('footer.copy')}</div>
            <div className="text-xs opacity-70 font-mono">Last updated: 2026-05-04</div>
          </div>
          <div className="flex gap-6">
            <a href={REPO} target="_blank" rel="noopener noreferrer" className="hover:text-text">
              GitHub
            </a>
            <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-text">
              {t('footer.issues')}
            </a>
            <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="hover:text-text">
              Claude Code
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-border rounded-lg p-6 bg-bg">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, code, desc }: { n: string; title: string; code: string; desc: string }) {
  return (
    <div>
      <div className="font-mono text-accent text-sm mb-3">step {n}</div>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <pre className="bg-surface border border-border rounded p-3 text-xs font-mono mb-3 whitespace-pre-wrap">{code}</pre>
      <p className="text-muted text-sm">{desc}</p>
    </div>
  );
}

function Kit({ emoji, name, desc, defaults }: { emoji: string; name: string; desc: string; defaults: string }) {
  return (
    <div className="border border-border rounded-lg p-6 bg-bg">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      <p className="text-muted text-sm mb-4 leading-relaxed">{desc}</p>
      <div className="text-xs font-mono text-muted">{defaults}</div>
    </div>
  );
}

function CategoryChip({ emoji, name, highRisk }: { emoji: string; name: string; highRisk: boolean }) {
  return (
    <div className={`border rounded-lg p-3 flex items-center gap-2 ${highRisk ? 'border-accent/60 bg-accent/5' : 'border-border bg-surface'}`}>
      <span className="text-lg">{emoji}</span>
      <span className="leading-tight">{name}</span>
      {highRisk && <span className="ml-auto text-[10px] font-mono text-accent">HIGH RISK</span>}
    </div>
  );
}

function PremiumKit({ emoji, name, desc, for_who }: { emoji: string; name: string; desc: string; for_who: string }) {
  return (
    <div className="border border-border rounded-lg p-6 bg-bg hover:border-accent/40 transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{emoji}</div>
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <p className="text-muted text-sm mb-4 leading-relaxed">{desc}</p>
      <div className="text-xs font-mono text-accent">→ {for_who}</div>
    </div>
  );
}
