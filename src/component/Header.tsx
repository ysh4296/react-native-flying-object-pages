'use client';

import { CheckCircleIcon, SunIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Link, Text } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const Header = () => {
  return (
    <Box
      w="100vw"
      h={16}
      padding={8}
      borderBottom="2px"
      borderColor="gray.100"
      opacity={0.9}
      position="fixed"
      bg="white"
      zIndex={99}
    >
      <HStack justifyContent="space-between" height="100%">
        <Link href="/" _hover={{ textDecoration: 'none' }}>
          <HStack
            height="100%"
            onClick={() => {
              alert('return to Home');
            }}
            _hover={{
              background: 'white',
              color: 'primary.600',
              cursor: 'pointer',
            }}
          >
            <CheckCircleIcon boxSize={8} />
            <Text
              fontWeight="800"
              _hover={{
                textDecoration: 'none',
              }}
            >
              React Native Flying Objects
            </Text>
          </HStack>
        </Link>
        <HStack>
          <Link href="https://github.com/ysh4296/react-native-flying-objects" isExternal>
            <IconButton
              variant="icon"
              border="none"
              aria-label="Call Segun"
              size="lg"
              icon={<FaGithub />}
            />
          </Link>
          <IconButton
            variant="icon"
            border="none"
            p={0}
            aria-label="Call Segun"
            size="md"
            icon={<SunIcon />}
            onClick={() => {
              alert('change to dark theme');
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;
