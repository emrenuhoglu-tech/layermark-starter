import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Layermark Starter — 1 dakikada Claude Code projesi',
  description:
    'Pocock + AI Engineer + Karpathy disiplinleriyle pre-shipped. 9 soru, 1 dakika, çalışan iskelet. TR/EN.',
  openGraph: {
    title: 'Layermark Starter',
    description: 'Claude Code projeleri için opinionated bootstrap. Doctrine + skills + agents pre-loaded.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
