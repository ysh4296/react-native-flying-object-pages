'use client';

import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Link,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import DocsList from '@component/list/DocsList';
import { FaGithub } from 'react-icons/fa';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDrawer = (props: MenuDrawerProps) => {
  const { isOpen, onClose } = props;
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Docs</DrawerHeader>
        <DrawerBody>
          <VStack w="100%" h="100%" justifyContent="space-between">
            <DocsList w="100%" />

            <HStack w="100%" justifyContent="flex-end">
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
                icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
              />
            </HStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
