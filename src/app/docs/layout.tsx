import { Box, HStack } from '@chakra-ui/react';
import DocsList from '@component/list/DocsList';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HStack h="100vh" pt={16} align="start">
      <DocsList hideBelow="md" />
      <Box
        px={16}
        width="100%"
        height="100%"
        overflowY="auto"
        borderLeft={['none', 'none', 'solid 2px']}
        borderColor="gray.100"
      >
        {children}
      </Box>
    </HStack>
  );
}
