import { Heading, Text } from '@chakra-ui/react';
import SnackBox from '@component/SnackBox';
import GettingStarted from '../markdown/gettingStarted.mdx';

export default function Home() {
  return (
    <>
      <Heading>React Native Flying Objects</Heading>
      <Text fontSize="3xl">React Native Package for Implement Interactive Objects!</Text>
      <SnackBox snackId="@dbtmdgns4296/demo" />
      <GettingStarted />
    </>
  );
}
