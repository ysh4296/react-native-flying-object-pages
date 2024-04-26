import Circle from "./circle";
import Draw from "../utils/draw";
import Rectangle from "./rectangle";
import Vector, { scaleVector } from "./vector";
import Calculator from "../utils/calculator";
import Collision from "../utils/collision";
import Shape from "./shape";
import Polygon from "./polygon";
import RigidBody from "./rigidbody";

export default class Engine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  drawUtils: Draw;
  calculatorUtils: Calculator;
  testCircle1: Circle;
  //   testCircle2: Circle;
  testRectangle1: Rectangle;
  testRectangle2: Rectangle;
  testRectangle3: Rectangle;
  triangle1: Polygon;
  shape: Shape[];
  collision: Collision;
  rigidBodies: RigidBody[];
  gravity: Vector;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    Draw.createInstance(ctx);
    this.drawUtils = Draw.getInstance();
    this.calculatorUtils = Calculator.getInstance();
    this.collision = Collision.getInstance();

    this.testCircle1 = new Circle(
      ctx,
      new Vector({ x: 50, y: 50 }),
      50,
      "black"
    );
    // this.testCircle2 = new Circle(
    //   ctx,
    //   new Vector({ x: 400, y: 200 }),
    //   50,
    //   "black"
    // );
    this.triangle1 = new Polygon(
      ctx,
      [
        new Vector({ x: 100, y: 100 }),
        new Vector({ x: 200, y: 100 }),
        new Vector({ x: 150, y: 150 }),
      ],
      "black"
    );
    this.testRectangle2 = new Rectangle(
      ctx,
      new Vector({ x: 400, y: 400 }),
      200,
      200,
      "black"
    );
    this.testRectangle1 = new Rectangle(
      ctx,
      new Vector({ x: 180, y: 400 }),
      200,
      200,
      "black"
    );
    this.testRectangle3 = new Rectangle(
      ctx,
      new Vector({ x: 620, y: 400 }),
      200,
      200,
      "black"
    );
    this.gravity = new Vector({ x: 0, y: 0.005 });
    this.shape = [];
    this.shape.push(this.testCircle1);
    this.shape.push(this.testRectangle1);
    this.shape.push(this.testRectangle2);
    this.shape.push(this.testRectangle3);
    this.shape.push(this.triangle1);
    this.rigidBodies = [];
    this.rigidBodies.push(new RigidBody(this.testCircle1, 100));
    this.rigidBodies.push(new RigidBody(this.testRectangle1, 100));
    this.rigidBodies.push(new RigidBody(this.testRectangle2, 100));
    this.rigidBodies.push(new RigidBody(this.testRectangle3, 100));
    this.rigidBodies.push(new RigidBody(this.triangle1, 100));
  }

  update = (deltaTime: number) => {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].addForce(this.gravity);
      this.rigidBodies[i].update(deltaTime);
    }
    // this.rigidBodies[0].log();
    // for (let i = 0; i < this.shape.length; i++) {
    //   for (let j = 0; j < this.shape.length; j++) {
    //     if (i === j) continue;
    //     let objectA = this.shape[i] as Polygon;
    //     let objectB = this.shape[j] as Polygon;
    //     let result = this.collision.checkCollision(objectA, objectB);
    //     if (result) {
    //       result.draw();
    //     }
    //     if (result) {
    //       let push = scaleVector(result.normal, result.depth * 0.5);
    //       objectB.move(push);
    //       objectA.move(scaleVector(push, -1));
    //     }
    //   }
    // }
  };

  draw = () => {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].getShape().draw();
    }
  };

  clear = () => {
    this.ctx.fillStyle = "white";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  onKeyboardPressed = (e: KeyboardEvent) => {
    switch (e.key) {
      case "d":
        this.rigidBodies[0].addForce(new Vector({ x: 0.005, y: 0 }));
        break;
      case "a":
        this.rigidBodies[0].addForce(new Vector({ x: -0.005, y: 0 }));
        break;
      case "w":
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: -0.005 }));
        break;
      case "s":
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: 0.005 }));
        break;
      //   case "ArrowRight":
      //     this.rigidBodies[0].rotate(0.05);
      //     break;
      //   case "ArrowLeft":
      //     this.rigidBodies[0].rotate(-0.05);
      //     break;
    }
  };
}
