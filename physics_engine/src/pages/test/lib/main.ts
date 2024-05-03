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
  let fpsIndicatorTime = 0;

  let mousePos = [0, 0];

  if (ctx) {
    const drawUtils = Draw.createInstance(ctx);
    const engine = new Engine(canvas, ctx, new Vector({ x: 1200, y: 700 }));

    let fpsText = "FPS";
    const loop = () => {
      let targetTime = performance.now();
      let deltaTime = targetTime - currentTime;
      engine.clear();
      engine.update(deltaTime);
      engine.draw();
      if (Math.abs(targetTime - fpsIndicatorTime) > 1000) {
        console.log();
        fpsText = Math.round(1000 / deltaTime) + " FPS";
        fpsIndicatorTime = targetTime;
      }
      drawUtils.drawText(new Vector({ x: 10, y: 20 }), 20, "black", fpsText);
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
