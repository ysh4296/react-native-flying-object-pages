'use client';

import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Link,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaBars, FaGithub } from 'react-icons/fa';
import DocsList from '@component/list/DocsList';

/**
 * @todo
 * color theme dark mode & light mode
 */
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <Link
              hideBelow={'md'}
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
              hideFrom="md"
              variant="icon"
              border="none"
              aria-label="Call Segun"
              size="lg"
              icon={<FaBars />}
              onClick={onOpen}
            />
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

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Docs</DrawerHeader>
          <DrawerBody>
            <VStack w="100%" h="100%" justifyContent="space-between">
              <DocsList w="100%" />

              <Link href="https://github.com/ysh4296/react-native-flying-objects" isExternal>
                <IconButton
                  variant="icon"
                  border="none"
                  aria-label="Call Segun"
                  size="lg"
                  icon={<FaGithub />}
                />
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
