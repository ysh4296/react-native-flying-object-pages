import { Box } from '@chakra-ui/react';
import Header from '@component/Header';
import { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'react native flying objects',
  description: 'React Native Package for Implement Interactive Objects',
  openGraph: {
    url: 'https://react-native-flying-objects.com',
    title: 'react native flying objects',
    description: 'React Native Package for Implement Interactive Objects',
    images: [
      {
        url: 'https://react-native-flying-objects.com/favicon.ico',
        width: 800,
        height: 600,
        alt: 'Og Image Alt',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Box h="100vh">
            <Header />
            {children}
            {/* <Footer /> */}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
