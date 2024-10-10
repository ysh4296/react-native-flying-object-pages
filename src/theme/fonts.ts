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

export const fonts = {
  pretendard,
};
