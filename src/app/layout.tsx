import type { Metadata } from 'next';

import './globals.css';

import SparklesText from '@/components/sparkle-title';
import { fontSans, siteConfig } from '@/lib/config';
import { ThemeProvider } from '@/provider/theme-provider';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, alt: siteConfig.name }],
  },
  twitter: {
    title: siteConfig.name,
    card: 'summary',
    site: siteConfig.links.twitter,
    images: [{ url: siteConfig.ogImage, alt: siteConfig.name }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={fontSans.className}>
        <ThemeProvider>
          <header className="container my-8 flex flex-col items-center justify-center">
            <SparklesText text="Mapa con todos los saltos de Bana" />
          </header>
          <div className="flex min-h-screen flex-col items-center justify-start justify-items-center p-8">
            {children}
          </div>
          <footer className="flex w-full flex-col items-center justify-center">
            <p className="text-sm text-gray-500">Este es un mapa de GTA San Andreas con todos los saltos del juego.</p>
            <div className="flex flex-row gap-2">
              <a href="https://github.com/SampProject-game/SVGMap-GTA-San-Andreas">Mapa Original</a>
              <a href="https://github.com/emirchus/los-saltos-de-bana">GitHub</a>
              <a href="https://x.com/pp0ke_/status/1838318507647201380/">Idea original</a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
