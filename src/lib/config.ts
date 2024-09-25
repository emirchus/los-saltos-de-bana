import { Inter as FontSans } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const siteConfig = {
  name: 'NextJS',
  url: '',
  ogImage: '',
  description: '',
  links: {
    twitter: '',
    github: '',
  },
};

export type SiteConfig = typeof siteConfig;
