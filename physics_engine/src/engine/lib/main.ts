import Draw from "../utils/draw";
import Engine from "./engine";
import Vector from "./vector";

export const registry: any = {
  engine: null as Engine | null,
  mouseEventType: "NONE",
  jointEventType: "NONE",
};

const main = (document: Document) => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "myCanvas"
  ) as HTMLCanvasElement;
  canvas.style.backgroundColor = "#eee";
  const ctx = canvas.getContext("2d");

  let currentTime = 0;

  if (ctx) {
    Draw.createInstance(ctx);
    registry.engine = new Engine(canvas, ctx, new Vector({ x: 1200, y: 700 }));
    currentTime = performance.now();
    const loop = () => {
      let targetTime = performance.now();
      let deltaTime = (targetTime - currentTime) / 1000;
      registry.engine.clear();
      registry.engine.update(deltaTime);
      registry.engine.draw();
      window.requestAnimationFrame(loop);
      currentTime = targetTime;
    };

    loop();

    canvas.addEventListener("mousemove", (e: MouseEvent) => {
      registry.engine.onMouseMove(e);
    });

    canvas.addEventListener("mousedown", (e: MouseEvent) => {
      registry.engine.onMouseDown(e);
    });

    canvas.addEventListener("mouseup", (e: MouseEvent) => {
      registry.engine.onMouseUp(e);
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      registry.engine.onKeyboardPressed(e);
    });
  }
};

export default main;
