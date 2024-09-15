'use client';

import { Button, Text } from '@chakra-ui/react';

const Container = () => {
  return (
    <>
      <canvas
        id="myCanvas"
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: -999,
        }}
      />
      <Text>physics Engine</Text>
      <Text>play</Text>
      <Button
        onClick={() => {
          console.log('clicked');
        }}
      >
        hihi
      </Button>
    </>
  );
};

export default Container;
