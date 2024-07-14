'use client';

import { Button, Text } from '@chakra-ui/react';
import EventSelect from '@component/eventSelect';
import { useEffect } from 'react';
import main, { registry } from '../../../engine/lib/main';

const Container = () => {
  useEffect(() => {
    if (document) {
      main(document);
    }
  }, []);

  return (
    <>
      <p>physics Engine</p>
      <canvas id="myCanvas" />
      <EventSelect
        eventName="MOUSE"
        setEventType={(mouseType) => {
          registry.mouseEventType = mouseType as MouseType;
        }}
      />
      <EventSelect
        eventName="JOINT"
        setEventType={(jointType) => {
          registry.jointEventType = jointType as JointType;
        }}
      />
      <EventSelect
        eventName="CREATE"
        setEventType={(createType) => {
          registry.createEventType = createType as CreateType;
        }}
      />
      <Text>play</Text>
      <Button
        onClick={() => {
          registry.engine.pause = !registry.engine?.pause;
        }}
      >
        {registry.engine?.pause ? 'pause' : 'play'}
      </Button>
    </>
  );
};

export default Container;
