import { Text, VStack } from '@chakra-ui/react';

const DocsList = () => {
  return (
    <VStack p={4} h="100%" borderRight="solid 1px" borderColor="gray.100">
      <Text fontWeight={700} color="primary.600" w="100%" textAlign="left">
        Getting Started
      </Text>
      <Text w="100%" textAlign="left">
        Installation
      </Text>
      <Text w="100%" textAlign="left">
        Examples
      </Text>
    </VStack>
  );
};

export default DocsList;
