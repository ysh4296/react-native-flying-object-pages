import { Box, Text, HStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box w="100vw" h={16} bg="gray.200" boxShadow="xl">
      <HStack justifyContent="center" h="100%">
        <Text textStyle="p" color="gray.500">
          dbtmdgns4296@naver.com
        </Text>
      </HStack>
    </Box>
  );
};

export default Footer;
