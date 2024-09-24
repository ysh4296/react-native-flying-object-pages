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
            <Text fontWeight="800" fontSize="6xl">
              React Native Flying Objects
            </Text>
            <Text fontSize="xl">React Native Package for Implement Interactive Objects!</Text>
          </VStack>
        </HStack>
        <HStack>
          <Link href={'/docs/GettingStarted'}>
            <Button
              variant="solid"
              onClick={() => {
                alert('to the started page');
              }}
            >
              <Text mr={2}>Getting Started</Text>
              <ExternalLinkIcon />
            </Button>
          </Link>
          <Link href="https://github.com/ysh4296/react-native-flying-objects" isExternal>
            <Button variant="outline">
              <Text
                mr={2}
                onClick={() => {
                  alert('link to github');
                }}
              >
                Github
              </Text>
              <FaGithub />
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Home;
