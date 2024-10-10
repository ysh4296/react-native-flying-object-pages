'use client';

import { CheckCircleIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Link, useColorMode, useDisclosure } from '@chakra-ui/react';
import { FaBars, FaGithub } from 'react-icons/fa';
import MenuDrawer from './MenuDrawer';

/**
 * @todo
 * color theme dark mode & light mode
 */
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box
        w="100vw"
        h={16}
        padding={8}
        borderBottom="2px"
        borderColor="gray.100"
        opacity={0.9}
        position="fixed"
        backdropFilter="blur(10px)"
        zIndex={99}
      >
        <HStack justifyContent="space-between" height="100%">
          <Link href="/" _hover={{ textDecoration: 'none' }}>
            <HStack
              height="100%"
              _hover={{
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
            <Link
              hideBelow="md"
              href="https://github.com/ysh4296/react-native-flying-objects"
              isExternal
            >
              <IconButton
                variant="icon"
                border="none"
                aria-label="Call Segun"
                size="lg"
                icon={<FaGithub />}
              />
            </Link>
            <IconButton
              hideBelow="md"
              variant="icon"
              border="none"
              p={0}
              aria-label="Call Segun"
              size="md"
              icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
            />
            <IconButton
              hideFrom="md"
              variant="icon"
              border="none"
              aria-label="Call Segun"
              size="lg"
              icon={<FaBars />}
              onClick={onOpen}
            />
          </HStack>
        </HStack>
      </Box>
      <MenuDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Header;
