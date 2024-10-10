'use client';

import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Link } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

/**
 * @todo
 * color theme dark mode & light mode
 */
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
            _hover={{
              background: 'white',
              color: 'primary.600',
              cursor: 'pointer',
            }}
          >
            <CheckCircleIcon boxSize={8} />
            <Box
              textStyle="h1"
              _hover={{
                textDecoration: 'none',
              }}
            >
              React Native Flying Objects
            </Box>
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
          {/* <IconButton
            variant="icon"
            border="none"
            p={0}
            aria-label="Call Segun"
            size="md"
            icon={<SunIcon />}
            onClick={() => {
              alert('change to dark theme');
            }}
          /> */}
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;
