import { registry } from './main';
import Vector from './vector';

const getMousePosition = (canvas: HTMLCanvasElement, e: MouseEvent): Vector => {
  const rect = canvas.getBoundingClientRect();
  const camera = registry.engine.camera;
  return new Vector({
    x: (e.clientX - rect.left - camera.x) / camera.scale,
    y: (e.clientY - rect.top - camera.y) / camera.scale,
  });
};

export default getMousePosition;
