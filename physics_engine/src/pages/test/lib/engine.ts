import Circle from "./circle";
import Draw from "./draw";
import Rectangle from "./rectangle";
import Vector from "./vector";

export default class Engine {
  drawUtils: Draw;
  testCircle: Circle;
  testRectangle: Rectangle;

  constructor(ctx: CanvasRenderingContext2D) {
    this.drawUtils = Draw.getInstance(ctx);
    this.testCircle = new Circle(ctx, new Vector({ x: 200, y: 200 }), 100);
    this.testRectangle = new Rectangle(
      ctx,
      new Vector({ x: 400, y: 400 }),
      200,
      200
    );
  }

  update = () => {};

  draw = () => {
    this.testCircle.draw();
    this.testRectangle.draw();
  };

  onKeyboardPressed = (e: KeyboardEvent) => {
    console.log(e.key);
  };
}
