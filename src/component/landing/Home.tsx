import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Center, HStack, Text, VStack } from '@chakra-ui/react';

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
          <Button
            variant="solid"
            onClick={() => {
              alert('to the started page');
            }}
          >
            <Text>Getting Started</Text>
            <ExternalLinkIcon marginLeft={4} />
          </Button>
          <Button>
            <Text
              onClick={() => {
                alert('link to github');
              }}
            >
              Github
            </Text>
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Home;
