import Draw from "../utils/draw";
import Engine from "./engine";
import getMousePosition from "./getMousePosition";
import Vector from "./vector";

const main = (document: Document) => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "myCanvas"
  ) as HTMLCanvasElement;
  canvas.style.backgroundColor = "#eee";
  const ctx = canvas.getContext("2d");

  let currentTime = 0;

  if (ctx) {
    Draw.createInstance(ctx);
    const engine = new Engine(canvas, ctx, new Vector({ x: 1200, y: 700 }));

    currentTime = performance.now();
    const loop = () => {
      let targetTime = performance.now();
      let deltaTime = (targetTime - currentTime) / 1000;
      engine.clear();
      engine.update(deltaTime);
      engine.draw();
      window.requestAnimationFrame(loop);
      currentTime = targetTime;
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
