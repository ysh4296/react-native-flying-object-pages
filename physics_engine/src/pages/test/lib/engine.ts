import Circle from "./circle";
import Draw from "../utils/draw";
import Rectangle from "./rectangle";
import Vector from "./vector";
import Calculator from "../utils/calculator";
import Collision from "../utils/collision";

export default class Engine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  drawUtils: Draw;
  calculatorUtils: Calculator;
  testCircle1: Circle;
  testCircle2: Circle;
  testRectangle: Rectangle;
  collision: Collision;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawUtils = Draw.getInstance(ctx);
    this.calculatorUtils = Calculator.getInstance();
    this.collision = Collision.getInstance();

    this.testCircle1 = new Circle(
      ctx,
      new Vector({ x: 200, y: 200 }),
      100,
      "black"
    );
    this.testCircle2 = new Circle(
      ctx,
      new Vector({ x: 400, y: 200 }),
      100,
      "black"
    );
    this.testRectangle = new Rectangle(
      ctx,
      new Vector({ x: 400, y: 400 }),
      200,
      200,
      "black"
    );
  }

  update = () => {};

  draw = () => {
    this.testCircle1.draw();
    this.testCircle2.draw();

    let result = this.collision.circlevscircle(
      this.testCircle1,
      this.testCircle2
    );
    if (result) {
      this.testCircle1.setColor("red");
      this.testCircle2.setColor("red");
    } else {
      this.testCircle1.setColor("black");
      this.testCircle2.setColor("black");
    }
  };

  clear = () => {
    this.ctx.fillStyle = "white";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  onKeyboardPressed = (e: KeyboardEvent) => {
    switch (e.key) {
      case "d":
        this.testCircle1.move(new Vector({ x: 5, y: 0 }));
        break;
      case "a":
        this.testCircle1.move(new Vector({ x: -5, y: 0 }));
        break;
      case "w":
        this.testCircle1.move(new Vector({ x: 0, y: -5 }));
        break;
      case "s":
        this.testCircle1.move(new Vector({ x: 0, y: 5 }));
        break;
      case "ArrowRight":
        this.testCircle1.rotate(5);
        break;
      case "ArrowLeft":
        this.testCircle1.rotate(-5);
        break;
    }
  };
}
