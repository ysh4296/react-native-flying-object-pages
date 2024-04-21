const getMousePosition = (
  canvas: HTMLCanvasElement,
  e: MouseEvent
): position => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

export default getMousePosition;
