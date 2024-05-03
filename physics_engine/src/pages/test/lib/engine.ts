import Circle from "./circle";
import Draw from "../utils/draw";
import Rectangle from "./rectangle";
import Vector, { addVector, scaleVector } from "./vector";
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
  testRectangle1: Polygon;
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
    this.drawUtils = Draw.getInstance();
    this.calculatorUtils = Calculator.getInstance();
    this.collision = Collision.getInstance();
    this.world = world;

    this.testCircle1 = new Circle(new Vector({ x: 150, y: 100 }), 50, "black");
    this.testCircle2 = new Circle(new Vector({ x: 100, y: 300 }), 50, "black");
    this.testCircle3 = new Circle(new Vector({ x: 200, y: 250 }), 50, "black");
    this.triangle1 = new Polygon(
      [
        new Vector({ x: 150, y: 150 }),
        new Vector({ x: 100, y: 100 }),
        new Vector({ x: 200, y: 100 }),
      ],
      "black"
    );
    this.testRectangle2 = new Rectangle(
      new Vector({ x: 250, y: 275 }),
      200,
      200,
      "black"
    );
    this.testRectangle1 = new Rectangle(
      new Vector({ x: 250, y: 150 }),
      200,
      200,
      "black"
    );
    // this.testRectangle1 = new Rectangle(
    //   ctx,
    //   new Vector({ x: 620, y: 600 }),
    //   1400,
    //   100,
    //   "black"
    // );
    // this.testRectangle1.rotate(0.2);
    this.testRectangle3 = new Rectangle(
      new Vector({ x: 620, y: 400 }),
      200,
      200,
      "black"
    );
    this.top = new Rectangle(
      new Vector({ x: this.world.x / 2 - 10, y: 10 }),
      this.world.x - 100,
      20,
      "red"
    );
    this.bottom = new Rectangle(
      new Vector({ x: this.world.x / 2 - 10, y: this.world.y - 10 }),
      this.world.x - 100,
      20,
      "red"
    );
    this.left = new Rectangle(
      new Vector({ x: 10, y: this.world.y / 2 - 10 }),
      20,
      this.world.y - 100,
      "red"
    );
    this.right = new Rectangle(
      new Vector({ x: this.world.x - 10, y: this.world.y / 2 - 10 }),
      20,
      this.world.y - 100,
      "red"
    );
    this.gravity = new Vector({ x: 0, y: 0.05 });
    this.rigidBodies = [];
    // this.rigidBodies.push(new RigidBody(this.triangle1, 100));
    // this.rigidBodies.push(new RigidBody(this.testRectangle1, 100));
    // this.rigidBodies.push(new RigidBody(this.testCircle1, 100));
    // this.rigidBodies.push(new RigidBody(this.testCircle2, 100));
    // this.rigidBodies.push(new RigidBody(this.testRectangle3, 100));
    // this.rigidBodies.push(new RigidBody(this.testCircle3, 100));
    // this.rigidBodies.push(new RigidBody(this.testRectangle2, 100));
    this.createTempPyramid();
    this.rigidBodies.push(new RigidBody(this.top, 0));
    this.rigidBodies.push(new RigidBody(this.bottom, 0));
    this.rigidBodies.push(new RigidBody(this.left, 0));
    this.rigidBodies.push(new RigidBody(this.right, 0));
  }

  update = (deltaTime: number) => {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].addForce(
        scaleVector(this.gravity, this.rigidBodies[i].mass / 100)
      );
      this.rigidBodies[i].update(deltaTime);
      this.rigidBodies[i].shape.boundingBox.collision = false;
    }
    for (let i = 0; i < this.rigidBodies.length; i++) {
      for (let j = 0; j < this.rigidBodies.length; j++) {
        if (i === j) continue;
        let objectA = this.rigidBodies[i];
        let objectB = this.rigidBodies[j];
        if (!objectA.shape.boundingBox.intersect(objectB.shape.boundingBox)) {
          // no collision
          continue;
        }
        let result = this.collision.checkCollision(
          objectA.shape,
          objectB.shape
        );
        if (result) {
          result.resolveCollision(objectA, objectB);
          result.positionalCorrection(objectA, objectB);
          result.draw();
        }
        objectA.shape.boundingBox.collision = true;
        objectB.shape.boundingBox.collision = true;
      }
    }
  };

  draw = () => {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].getShape().draw();
      this.rigidBodies[i].shape.calculateBoundingBox();
      this.rigidBodies[i].getShape().boundingBox.draw();
    }
  };

  clear = () => {
    this.ctx.fillStyle = "white";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  createTempPyramid() {
    let boxSize = 80;
    let iteration = 10;
    let leftOffset = 400;
    let topOffset = this.world.y - iteration * boxSize - 10;
    for (let i = 0; i < iteration; i++) {
      for (let j = iteration; j >= iteration - i; j--) {
        let x = boxSize * i + (boxSize * j) / 2;
        let y = boxSize * j;
        this.rigidBodies.push(
          new RigidBody(
            new Rectangle(
              new Vector({ x: x + leftOffset, y: y + topOffset }),
              boxSize,
              boxSize,
              "black"
            ),
            1
          )
        );
      }
    }
  }

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
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: 1 }));
        break;
      case "ArrowRight":
        this.rigidBodies[0].shape.rotate(0.05);
        break;
      case "ArrowLeft":
        this.rigidBodies[0].shape.rotate(-0.05);
        break;
    }
  };
}
