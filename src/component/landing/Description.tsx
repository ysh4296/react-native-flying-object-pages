import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text, Center, VStack, Button, Link } from '@chakra-ui/react';
import SnackBox from '@component/SnackBox';

const Description = () => {
  return (
    <Center width="100vw">
      <VStack width="80%" gap={16} padding={16} borderTop="1px" borderColor="gray.300">
        <Text fontWeight="800" fontSize="4xl">
          Implement Creative Components!
        </Text>
        <SnackBox snackId="@dbtmdgns4296/flow-example" />
        <Link>
          <Button variant="solid">
            <Text>See More Examples</Text>
            <ExternalLinkIcon marginLeft={4} />
          </Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default Description;
