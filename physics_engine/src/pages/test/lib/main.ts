import Engine from "./engine";
import getMousePosition from "./getMousePosition";

const main = (document: Document) => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "myCanvas"
  ) as HTMLCanvasElement;
  canvas.style.backgroundColor = "#eee";
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.beginPath();
    ctx.rect(20, 40, 50, 50);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  let currentTime = 0;

  let mousePos = [0, 0];

  const engine = new Engine();

  const loop = () => {
    window.requestAnimationFrame(loop);
    currentTime = performance.now();
  };

  loop();

  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    const currentPosition = getMousePosition(canvas, e);
    console.log(currentPosition);
  });

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    engine.onKeyboardPressed(e);
  });
};

export default main;
