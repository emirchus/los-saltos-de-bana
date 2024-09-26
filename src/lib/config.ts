// eslint-disable-next-line import/no-unresolved
import { GeistMono } from 'geist/font/mono';

export const fontSans = GeistMono;

export const siteConfig = {
  name: 'Los Saltos de Bana',
  url: 'https://saltos.emirchus.ar',
  ogImage: 'https://saltos.emirchus.ar/og-image.png',
  description:
    'Los Saltos de Bana es una empresa familiar dedicada a la producción de miel de abeja y productos relacionados. Fundada en 2015, hemos cultivado una reputación sólida por la calidad de nuestros productos y nuestro compromiso con la excelencia.',
  links: {
    twitter: 'https://twitter.com/emirchus',
    github: 'https://github.com/emirchus',
  },
};

export type SiteConfig = typeof siteConfig;
