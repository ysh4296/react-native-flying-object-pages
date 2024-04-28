import Circle from "./circle";
import Draw from "../utils/draw";
import Rectangle from "./rectangle";
import Vector, { scaleVector } from "./vector";
import Calculator from "../utils/calculator";
import Collision from "../utils/collision";
import Polygon from "./polygon";
import RigidBody from "./rigidbody";

export default class Engine {
  canvas: HTMLCanvasElement;
  world: Vector;
  ctx: CanvasRenderingContext2D;
  drawUtils: Draw;
  calculatorUtils: Calculator;
  testCircle1: Circle;
  testCircle2: Circle;
  testCircle3: Circle;
  testRectangle1: Rectangle;
  testRectangle2: Rectangle;
  testRectangle3: Rectangle;
  top: Rectangle;
  bottom: Rectangle;
  left: Rectangle;
  right: Rectangle;
  triangle1: Polygon;
  collision: Collision;
  rigidBodies: RigidBody[];
  gravity: Vector;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    world: Vector
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    Draw.createInstance(ctx);
    this.drawUtils = Draw.getInstance();
    this.calculatorUtils = Calculator.getInstance();
    this.collision = Collision.getInstance();
    this.world = world;

    this.testCircle1 = new Circle(
      ctx,
      new Vector({ x: 150, y: 500 }),
      50,
      "black"
    );
    this.testCircle2 = new Circle(
      ctx,
      new Vector({ x: 100, y: 150 }),
      50,
      "black"
    );
    this.testCircle3 = new Circle(
      ctx,
      new Vector({ x: 200, y: 250 }),
      50,
      "black"
    );
    this.triangle1 = new Polygon(
      ctx,
      [
        new Vector({ x: 150, y: 50 }),
        new Vector({ x: 100, y: 0 }),
        new Vector({ x: 200, y: 0 }),
      ],
      "black"
    );
    this.testRectangle2 = new Rectangle(
      ctx,
      new Vector({ x: 600, y: 275 }),
      200,
      200,
      "black"
    );
    this.testRectangle1 = new Rectangle(
      ctx,
      new Vector({ x: 600, y: 150 }),
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
    this.top = new Rectangle(
      ctx,
      new Vector({ x: this.world.x / 2 - 10, y: 10 }),
      this.world.x - 100,
      20,
      "red"
    );
    this.bottom = new Rectangle(
      ctx,
      new Vector({ x: this.world.x / 2 - 10, y: this.world.y - 10 }),
      this.world.x - 100,
      20,
      "red"
    );
    this.left = new Rectangle(
      ctx,
      new Vector({ x: 10, y: this.world.y / 2 - 10 }),
      20,
      this.world.y - 100,
      "red"
    );
    this.right = new Rectangle(
      ctx,
      new Vector({ x: this.world.x - 10, y: this.world.y / 2 - 10 }),
      20,
      this.world.y - 100,
      "red"
    );
    this.gravity = new Vector({ x: 0, y: 0.05 });
    this.rigidBodies = [];
    this.rigidBodies.push(new RigidBody(this.testCircle1, 500));
    this.rigidBodies.push(new RigidBody(this.top, 0));
    this.rigidBodies.push(new RigidBody(this.bottom, 0));
    this.rigidBodies.push(new RigidBody(this.testRectangle1, 500));
    this.rigidBodies.push(new RigidBody(this.right, 0));
    this.rigidBodies.push(new RigidBody(this.testCircle2, 500));
    this.rigidBodies.push(new RigidBody(this.left, 0));
    this.rigidBodies.push(new RigidBody(this.testRectangle3, 500));
    this.rigidBodies.push(new RigidBody(this.testCircle3, 500));
    this.rigidBodies.push(new RigidBody(this.testRectangle2, 500));
    this.rigidBodies.push(new RigidBody(this.triangle1, 500));
  }

  update = (deltaTime: number) => {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].addForce(
        scaleVector(this.gravity, this.rigidBodies[i].mass / 100)
      );
      if (!this.rigidBodies[i].isKinematic) {
        this.rigidBodies[i].update(deltaTime);
      }
    }
    for (let i = 0; i < this.rigidBodies.length; i++) {
      for (let j = 0; j < this.rigidBodies.length; j++) {
        if (i === j) continue;
        let objectA = this.rigidBodies[i];
        let objectB = this.rigidBodies[j];
        let result = this.collision.checkCollision(
          objectA.shape,
          objectB.shape
        );
        if (result) {
          result.resolveCollision(objectA, objectB);
          result.positionalCorrection(objectA, objectB);
          result.draw();
        }
      }
    }
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
        this.rigidBodies[0].addForce(new Vector({ x: 1, y: 0 }));
        break;
      case "a":
        this.rigidBodies[0].addForce(new Vector({ x: -1, y: 0 }));
        break;
      case "w":
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: -1 }));
        break;
      case "s":
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: -50 }));
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
