import Draw from '@engine/utils/draw';
import Engine from './engine';
import Vector from './vector';

export const registry: registryType = {
  id: 0,
  engine: null as Engine | null,
  mouseEventType: 'NONE',
  jointEventType: 'NONE',
  createEventType: 'NONE',
};

const main = (document: Document) => {
  const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
  canvas.style.backgroundColor = '#eee';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let currentTime = 0;

  if (ctx) {
    Draw.createInstance(ctx);
    registry.engine = new Engine(
      canvas,
      ctx,
      new Vector({ x: window.innerWidth, y: window.innerHeight }),
    );
    currentTime = performance.now();
    const loop = () => {
      let targetTime = performance.now();
      let deltaTime = (targetTime - currentTime) / 1000;
      registry.engine.setZoom();
      registry.engine.clear();
      if (registry.engine.pause) {
        registry.engine.updateEdit();
      } else {
        registry.engine.update(deltaTime);
      }
      registry.engine.draw();
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
