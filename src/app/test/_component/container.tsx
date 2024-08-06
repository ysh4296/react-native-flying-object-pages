'use client';

import { Button, Text } from '@chakra-ui/react';
import EventSelect from '@component/eventSelect';
import BaconBlock from '@engine/lib/block/baconBlock';
import BreadBlock from '@engine/lib/block/breadBlock';
import Grill from '@engine/lib/block/mover/grill';
import Spring from '@engine/lib/block/mover/spring';
import Wheel from '@engine/lib/block/mover/wheel';
import WaterBlock from '@engine/lib/block/waterBlock';
import Circle from '@engine/lib/rigidbody/circle';
import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';
import Vector from '@engine/lib/vector';
import { assertUnreachableChecker } from '@utils/typeChecker';
import { useEffect } from 'react';
import useGamePhaseStore from 'store/gamePhase';
import useMouseStore from 'store/mouseStore';
import main, { registry } from '../../../engine/lib/main';
import init, { greet, fibonacci } from '../../../../rust-module/pkg/rust_module';
// import { memory } from '../../../../rust-module/pkg/rust_module_bg.wasm';

const Container = () => {
  const { setMouseEventType } = useMouseStore();
  const { gamePhase, setGamePhase } = useGamePhaseStore();

  useEffect(() => {
    if (document) {
      init().then(async (wasm) => {
        console.log('hi');
        console.log(greet('Next.js and WebAssembly'));
        console.log(fibonacci(10));
        console.log('init Document!');
        // new FluidHashGrid(1000);
        console.log('grid created');
        // console.log(new Particle(new rustVector(1000, 0), 'blue').position.x);
        // const res = await fetch('../../../../rust-module/pkg/rust_module_bg.wasm');
        // console.log(res);
        // // // bytes from memory
        // const buffer = await res.arrayBuffer();
        // // // this will create an object
        // // // WebAssembly is part of window api. so make sure you are on client side.
        // const wasm = await WebAssembly.instantiate(buffer);
        // console.log('wasm', wasm);
        // console.log(memory);
        registry.memory = wasm.memory;
        main(document, setMouseEventType);
        // console.log(wasm.memory);
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
            case 'WATERBLOCK':
              registry.engine.CreateMouseEvent.target = new WaterBlock(
                new Vector({ x: 0, y: 0 }),
                registry.engine.GameBoard.cellSize,
                registry.engine.GameBoard.cellSize,
                'blue',
              );
              break;
            case 'CIRCLE':
              registry.engine.CreateMouseEvent.target = new RigidBody(
                new Circle(new Vector({ x: 0, y: 0 }), registry.engine.GameBoard.cellSize, 'green'),
                1,
              );
              break;
            case 'BACONBLOCK':
              registry.engine.CreateMouseEvent.target = new BaconBlock(
                new Vector({ x: 0, y: 0 }),
                registry.engine.GameBoard.cellSize,
                registry.engine.GameBoard.cellSize,
                'blue',
              );
              break;
            case 'BREADBLOCK':
              registry.engine.CreateMouseEvent.target = new BreadBlock(
                new Vector({ x: 0, y: 0 }),
                registry.engine.GameBoard.cellSize,
                registry.engine.GameBoard.cellSize,
                'blue',
              );
              break;
            // case 'ESCALATOR':
            //   registry.engine.CreateMouseEvent.target = new Escalator(
            //     new Vector({ x: 0, y: 0 }),
            //     registry.engine.GameBoard.cellSize,
            //     registry.engine.GameBoard.cellSize,
            //     'purple',
            //     new Vector({ x: 1, y: 0 }),
            //     50,
            //   );
            //   break;
            case 'SPRING':
              registry.engine.CreateMouseEvent.target = new Spring(
                new Vector({ x: 0, y: 0 }),
                registry.engine.GameBoard.cellSize,
                registry.engine.GameBoard.cellSize,
                'purple',
              );
              break;
            case 'HEATER':
              registry.engine.CreateMouseEvent.target = new Grill(
                new Vector({ x: 0, y: 0 }),
                registry.engine.GameBoard.cellSize,
                registry.engine.GameBoard.cellSize,
                'red',
              );
              break;
            case 'WHEEL':
              registry.engine.CreateMouseEvent.target = new Wheel(
                new Vector({ x: 0, y: 0 }),
                registry.engine.GameBoard.cellSize / 2,
                'red',
              );
              break;
            case 'FAN':
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
            case 'PRESSURE':
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
            case 'GRINDER':
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
