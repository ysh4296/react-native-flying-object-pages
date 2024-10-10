import { Text, VStack } from '@chakra-ui/react';
import PathButton from './PathButton';

const DocsList = () => {
  return (
    <VStack hideBelow={'md'} p={4} h="100%" borderRight="solid 1px" borderColor="gray.100">
      <Text whiteSpace="nowrap" textStyle="h3" color="primary.600" w="100%" textAlign="left">
        Getting Started
      </Text>
      <PathButton content="Overview" />
      <Text whiteSpace="nowrap" textStyle="h3" color="primary.600" w="100%" textAlign="left">
        Examples
      </Text>
      <PathButton content="Flow" />
      <PathButton content="Confetti" />
    </VStack>
  );
};

export default DocsList;
