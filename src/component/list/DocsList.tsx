import { Text, VStack } from '@chakra-ui/react';
import PathButton from './PathButton';

const DocsList = () => {
  return (
    <VStack p={4} h="100%" borderRight="solid 1px" borderColor="gray.100">
      <Text fontWeight={700} color="primary.600" w="100%" textAlign="left">
        Getting Started
      </Text>
      <PathButton content="Overview" />
      <PathButton content="Examples" />
    </VStack>
  );
};

export default DocsList;
