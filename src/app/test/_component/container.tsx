'use client';

import { Button, Text } from '@chakra-ui/react';
import EventSelect from '@component/eventSelect';
import Vector from '@engine/lib/vector';
import RigidBody from '@rigidbody/rigidbody';
import Rectangle from '@rigidbody/rectangle';
import Circle from '@engine/lib/rigidbody/circle';
import { assertUnreachableChecker } from '@utils/typeChecker';
import { useEffect } from 'react';
import useGamePhaseStore from 'store/gamePhase';
import useMouseStore from 'store/mouseStore';
import main, { registry } from '../../../engine/lib/main';
import init from '../../../../rust-module/pkg/rust_module';
import Sprite from '@engine/utils/sprite';
import Animation from '@engine/utils/animation';
import { initSkillData } from '@engine/lib/game/data/skillData';

const Container = () => {
  const { setMouseEventType } = useMouseStore();
  const { gamePhase, setGamePhase } = useGamePhaseStore();

  useEffect(() => {
    if (document) {
      init().then(async (wasm) => {
        await initSkillData();
        registry.memory = wasm.memory;

        const sprite = new Sprite();
        const animation = new Animation();
        registry.sprite = sprite;
        await sprite.init();

        await animation.init();
        registry.animation = animation;

        main(document, setMouseEventType);
      });
    }
  }, [setMouseEventType]);

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
          switch (registry.createEventType) {
            case 'NONE':
              break;
            case 'RECTANGLE':
              registry.engine.CreateMouseEvent.target = new RigidBody(
                new Rectangle(
                  new Vector({ x: 0, y: 0 }),
                  registry.engine.GameBoard.cellSize,
                  registry.engine.GameBoard.cellSize,
                  'green',
                ),
                1,
              );
              break;
            case 'CIRCLE':
              registry.engine.CreateMouseEvent.target = new RigidBody(
                new Circle(new Vector({ x: 0, y: 0 }), registry.engine.GameBoard.cellSize, 'green'),
                1,
              );
              break;
            case 'MAGICIAN':
              registry.engine.CreateMouseEvent.target = new RigidBody(
                new Rectangle(
                  new Vector({ x: 0, y: 0 }),
                  registry.engine.GameBoard.cellSize,
                  registry.engine.GameBoard.cellSize,
                  'black',
                ),
                1,
              );
              break;
            default:
              assertUnreachableChecker(registry.createEventType);
          }
        }}
      />
      <Text>play</Text>
      <Button
        onClick={() => {
          if (gamePhase === 'pause') setGamePhase('play');
          else setGamePhase('pause');
        }}
      >
        {gamePhase}
      </Button>
    </>
  );
};

export default Container;
