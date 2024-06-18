import Vector from "./vector";

const getMousePosition = (canvas: HTMLCanvasElement, e: MouseEvent): Vector => {
  var rect = canvas.getBoundingClientRect();
  return new Vector({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });
};

export default getMousePosition;
