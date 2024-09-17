import { Box } from '@chakra-ui/react';
import Footer from '@component/Footer';
import Header from '@component/Header';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Box h="100vh">
            <Header />
            {children}
            <Footer />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
