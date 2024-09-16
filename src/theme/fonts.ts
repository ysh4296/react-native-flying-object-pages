// app/fonts.ts
import { Rubik, Lato, Inter, Bungee } from 'next/font/google';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    {
      path: '../fonts/Pretendard-Regular.woff2',
      weight: '400',
    },
    {
      path: '../fonts/Pretendard-Medium.woff2',
      weight: '500',
    },
    {
      path: '../fonts/Pretendard-SemiBold.woff2',
      weight: '600',
    },
    {
      path: '../fonts/Pretendard-Bold.woff2',
      weight: '700',
    },
    {
      path: '../fonts/Pretendard-ExtraBold.woff2',
      weight: '800',
    },
  ],
  variable: '--pretendard',
  display: 'swap',
  weight: '400',
});

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
  pretendard,
};
