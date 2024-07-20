'use client';

import { Button, Text } from '@chakra-ui/react';
import EventSelect from '@component/eventSelect';
import { useEffect } from 'react';
import useMouseStore from 'store/mouseStore';
import main, { registry } from '../../../engine/lib/main';

const Container = () => {
  const { setMouseEventType } = useMouseStore();

  useEffect(() => {
    if (document) {
      main(document, setMouseEventType);
    }
  }, [setMouseEventType]);

  return (
    <>
      <p>physics Engine</p>
      <canvas id="myCanvas" />
      <EventSelect
        eventName="MOUSE"
        setEventType={(mouseType) => {
          registry.setMouseEventType(mouseType as MouseType);
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
