// eslint-disable-next-line import/no-unresolved
import { GeistSans as Font } from 'geist/font/sans';

// Use local font called Pricedown Bl.otf
import localFont from 'next/font/local';

export const pricedownBl = localFont({
  src: [
    {
      path: './Pricedown Bl.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-pricedown-bl',
  display: 'swap',
});

export const fontSans = Font;

export const siteConfig = {
  name: 'Los Piola de Bana',
  url: 'https://losmaspiola.com',
  ogImage: 'https://losmaspiola.com/og.png',
  description:
    'Los Piola de Bana es una empresa familiar dedicada a la producción de miel de abeja y productos relacionados. Fundada en 2015, hemos cultivado una reputación sólida por la calidad de nuestros productos y nuestro compromiso con la excelencia.',
};

export type SiteConfig = typeof siteConfig;
