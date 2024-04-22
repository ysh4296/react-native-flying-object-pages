import Circle from "./circle";
import Draw from "../utils/draw";
import Rectangle from "./rectangle";
import Vector from "./vector";
import Calculator from "../utils/calculator";

export default class Engine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  drawUtils: Draw;
  calculatorUtils: Calculator;
  testCircle: Circle;
  testRectangle: Rectangle;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawUtils = Draw.getInstance(ctx);
    this.calculatorUtils = Calculator.getInstance();

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

  clear = () => {
    this.ctx.fillStyle = "white";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  onKeyboardPressed = (e: KeyboardEvent) => {
    console.log(e.key);
    switch (e.key) {
      case "d":
        this.testRectangle.move(new Vector({ x: 5, y: 0 }));
        break;
      case "a":
        this.testRectangle.move(new Vector({ x: -5, y: 0 }));
        break;
      case "w":
        this.testRectangle.move(new Vector({ x: 0, y: -5 }));
        break;
      case "s":
        this.testRectangle.move(new Vector({ x: 0, y: 5 }));
        break;
      case "ArrowRight":
        this.testRectangle.rotate(5);
        break;
      case "ArrowLeft":
        this.testRectangle.rotate(-5);
        break;
    }
  };
}
