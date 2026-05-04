import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from './i18n';

const SITE_URL = 'https://emrenuhoglu-tech.github.io/layermark-starter';
const LAST_UPDATED = '2026-05-04';

export const metadata: Metadata = {
  title: 'Layermark Starter — Claude Code project in 1 minute / 1 dakikada Claude Code projesi',
  description:
    'Pre-shipped with Pocock + AI Engineer + Karpathy doctrine. 10 questions, 1 minute, working scaffold. TR/EN.',
  openGraph: {
    title: 'Layermark Starter',
    description: 'Opinionated bootstrap for Claude Code projects. Doctrine + skills + agents pre-loaded.',
    type: 'website',
    url: SITE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Layermark Starter',
  description:
    'Open-source Claude Code project starter pack. 20 doctrine rules, 14 foundational skills, 10 domain categories, prompt-engineer subagent, TR/EN first-run wizard pre-shipped.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: SITE_URL,
  codeRepository: 'https://github.com/emrenuhoglu-tech/layermark-starter',
  license: 'https://opensource.org/licenses/MIT',
  inLanguage: ['tr', 'en'],
  dateModified: LAST_UPDATED,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
