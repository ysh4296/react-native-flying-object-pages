import { jsonData } from '@engine/levels/1-1';
import Draw from '@engine/utils/draw';
import Sprite from '@engine/utils/sprite';
import Monster from './component/defense/monster';
import Engine from './engine';
import Vector from './vector';

/**
 * to use Engine as class Type the type hasbeen added seperatly from default Registry type
 */
export const registry: defaultRegistryType & { engine: Engine; sprite: Sprite } = {
  createdId: 0,
  createdObjects: new Set(),
  selectedComponentId: -1,
  engine: null as unknown as Engine,
  sprite: null as unknown as Sprite,
  mouseEventType: 'NONE',
  jointEventType: 'NONE',
  createEventType: 'NONE',
  animationOffset: 0,
  gameTime: 0,
  setMouseEventType: () => {},
  gamePhase: 'pause',
  memory: {
    buffer: new ArrayBuffer(0),
    grow: () => 0,
  },
};

const main = (document: Document, setMouseEventType: (mouseType: MouseType) => void) => {
  const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
  canvas.style.backgroundColor = '#eee';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const levelData = jsonData;

  let currentTime = 0;

  if (ctx) {
    Draw.createInstance(ctx);
    registry.engine = new Engine(
      canvas,
      ctx,
      new Vector({ x: window.innerWidth, y: window.innerHeight }),
    );
    currentTime = performance.now();
    registry.setMouseEventType = (mouseType) => {
      setMouseEventType(mouseType);
    };
    const loop = () => {
      /** update animationOffset */
      registry.animationOffset = (registry.animationOffset + 1) % 60;

      // console.log(levelData[0].time * 60);
      while (levelData.length > 0 && levelData[0].time * 60 <= registry.gameTime) {
        const object = levelData.shift();
        if (object) {
          // const monster = new Monster(object.position, 100);
          // monster.addComponent();
          // registry.engine.components.push(monster);
          for (let i = 0; i < object.numbers; i++) {
            const monster = new Monster(object.position, 200);
            monster.addComponent();
            registry.engine.components.push(monster);
          }
        }
      }

      let targetTime = performance.now();
      let deltaTime = (targetTime - currentTime) / 1000;

      registry.engine.setZoom();
      registry.engine.clear();
      if (registry.gamePhase === 'pause') {
        registry.engine.updateEdit();
      } else {
        registry.gameTime = registry.gameTime + 1;
        registry.engine.update(deltaTime);
      }
      registry.engine.draw();
      if (registry.mouseEventType === 'EDIT') {
        /** Draw edit helper for editing Selected Object*/
        registry.engine.drawSelect();
      }
      registry.engine.restoreZoom();
      window.requestAnimationFrame(loop);
      currentTime = targetTime;
    };

    loop();

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      registry.engine.onMouseMove(e);
    });

    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      registry.engine.onMouseDown(e);
    });

    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      registry.engine.onMouseUp(e);
    });

    canvas.addEventListener('mouseout', (e: MouseEvent) => {
      if (registry.mouseEventType === 'DRAG') registry.engine.onMouseUp(e);
    });

    canvas.addEventListener('wheel', (e: WheelEvent) => {
      registry.engine.onWheel(e);
    });

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      registry.engine.onKeyboardPressed(e);
    });

    window.addEventListener(
      'resize',
      () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      },
      false,
    );
  }
};

export default main;
