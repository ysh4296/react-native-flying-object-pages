// app/fonts.ts
import { Rubik, Lato, Inter, Bungee } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const bungee = Bungee({
  subsets: ['latin'],
  weight: ['400'],
});

export const fonts = {
  rubik,
  inter,
  lato,
  bungee,
};
