// app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { MDXProvider } from '@mdx-js/react';
import { theme } from 'theme/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <MDXProvider>{children}</MDXProvider>
    </ChakraProvider>
  );
}
