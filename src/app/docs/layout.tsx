import { Box, HStack } from '@chakra-ui/react';
import DocsList from '@component/list/DocsList';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HStack h="100vh" pt={16} align="start">
      <DocsList />
      <Box px={16}>{children}</Box>
    </HStack>
  );
}
