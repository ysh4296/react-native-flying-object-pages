import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Center, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const Home = () => {
  return (
    <Center width="100vw" height="900px">
      <VStack gap={16}>
        <HStack gap={16}>
          <CheckCircleIcon boxSize={16} />
          <VStack>
            <Text textStyle="h1">React Native Flying Objects</Text>
            <Text textStyle="p">React Native Package for Implement Interactive Objects!</Text>
          </VStack>
        </HStack>
        <HStack>
          <Link href={'/docs/Overview'}>
            <Button variant="solid">
              <Text mr={2}>Getting Started</Text>
              <ExternalLinkIcon />
            </Button>
          </Link>
          <Link href="https://github.com/ysh4296/react-native-flying-objects" isExternal>
            <Button variant="outline">
              <Text mr={2}>Github</Text>
              <FaGithub />
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Home;
