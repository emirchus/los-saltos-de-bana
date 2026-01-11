import type { Metadata } from 'next';

import './globals.css';

import { PiolaStatusSplash } from '@/components/piola-status-splash';
import { Toaster } from '@/components/ui/sonner';
import { fontSans, pricedownBl, siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/provider/query-provider';
import { SupabaseClientProvider } from '@/provider/supabase-provider';
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
    siteName: siteConfig.name,
  },
  twitter: {
    title: siteConfig.name,
    description: siteConfig.description,
    card: 'summary_large_image',
    site: siteConfig.url,
    images: [{ url: siteConfig.ogImage, alt: siteConfig.name }],
  },
  authors: [
    {
      name: 'Emirchus',
      url: 'https://emirchus.ar',
    },
    {
      name: 'Emaidana09',
      url: 'https://x.com/emaidana09',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(fontSans.className, pricedownBl.variable)}>
        <QueryProvider>
          <SupabaseClientProvider>
            <ThemeProvider>
              {children}
              <PiolaStatusSplash />
              <Toaster />
            </ThemeProvider>
          </SupabaseClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
