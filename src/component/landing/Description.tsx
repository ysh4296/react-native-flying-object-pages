import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text, Center, VStack, Button } from '@chakra-ui/react';
import SnackBox from '@component/SnackBox';

const Description = () => {
  return (
    <Center width="100vw">
      <VStack width="80%" gap={16} padding={16} borderTop="1px" borderColor="gray.300">
        <Text fontWeight="800" fontSize="4xl">
          For Creative Components!
        </Text>
        <SnackBox snackId="@dbtmdgns4296/demo" />
        <Button variant="solid">
          <Text>See More Examples</Text>
          <ExternalLinkIcon marginLeft={4} />
        </Button>
      </VStack>
    </Center>
  );
};

export default Description;
