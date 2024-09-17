'use client';

import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, HStack, Text } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box w="100vw" h={16} border="1px" opacity={0.9} position="fixed" bg="white" zIndex={99}>
      <HStack justifyContent="space-between" height="100%">
        <HStack
          height="100%"
          onClick={() => {
            alert('return to Home');
          }}
          _hover={{
            background: 'white',
            color: 'teal.500',
            cursor: 'pointer',
          }}
        >
          <CheckCircleIcon boxSize={8} />
          <Text>React Native Flying Objects</Text>
        </HStack>
        <Text>Theme & etc</Text>
      </HStack>
    </Box>
  );
};

export default Header;
