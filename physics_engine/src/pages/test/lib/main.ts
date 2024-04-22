import Engine from "./engine";
import getMousePosition from "./getMousePosition";

const main = (document: Document) => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "myCanvas"
  ) as HTMLCanvasElement;
  canvas.style.backgroundColor = "#eee";
  const ctx = canvas.getContext("2d");

  let currentTime = 0;

  let mousePos = [0, 0];

  if (ctx) {
    const engine = new Engine(ctx);
    engine.draw();

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
  }
};

export default main;
