import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from './i18n';

export const metadata: Metadata = {
  title: 'Layermark Starter — Claude Code project in 1 minute / 1 dakikada Claude Code projesi',
  description:
    'Pre-shipped with Pocock + AI Engineer + Karpathy doctrine. 9 questions, 1 minute, working scaffold. TR/EN.',
  openGraph: {
    title: 'Layermark Starter',
    description: 'Opinionated bootstrap for Claude Code projects. Doctrine + skills + agents pre-loaded.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-bg text-text antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
