import Draw from "./draw";
import Vector from "./vector";

export default class Engine {
  drawUtils;

  constructor(ctx: CanvasRenderingContext2D) {
    this.drawUtils = new Draw(ctx);
  }

  update = () => {};

  draw = () => {
    // this.drawUtils.drawPoint(new Vector({ x: 400, y: 400 }), 20, "red");
    // this.drawUtils.strokePoint(new Vector({ x: 700, y: 400 }), 20, "red");
    // this.drawUtils.drawLine(
    //   new Vector({ x: 200, y: 200 }),
    //   new Vector({ x: 500, y: 500 }),
    //   "blue"
    // );
    // this.drawUtils.drawText(
    //   new Vector({ x: 800, y: 500 }),
    //   21,
    //   "black",
    //   "hello world"
    // );
    this.drawUtils.drawArrow(
      new Vector({ x: 200, y: 600 }),
      new Vector({ x: 200, y: 200 }),
      "black"
    );
  };

  onKeyboardPressed = (e: KeyboardEvent) => {
    console.log(e.key);
  };
}
