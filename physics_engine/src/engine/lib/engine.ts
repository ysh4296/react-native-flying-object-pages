import Circle from "./circle";
import Draw from "../utils/draw";
import Rectangle from "./rectangle";
import Vector, { scaleVector } from "./vector";
import Calculator from "../utils/calculator";
import Collision from "../utils/collision";
import Polygon from "./polygon";
import RigidBody from "./rigidbody";
import SpatialGrid from "../optimization/spatialGrid";
import HashGrid from "../optimization/hashGrid";
import GrabMouse from "../event/grabMouse";
import Joint from "../joints/joint";
import { registry } from "./main";
import JointMouse from "../event/jointMouse";

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
  iteration: number;
  grid: SpatialGrid;
  GrabMouseEvent: GrabMouse;
  JointMouseEvent: JointMouse;
  joints: Joint[];

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    world: Vector
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawUtils = Draw.getInstance();
    this.joints = [];
    this.GrabMouseEvent = new GrabMouse();
    this.JointMouseEvent = new JointMouse();
    this.calculatorUtils = Calculator.getInstance();
    this.collision = Collision.getInstance();
    this.world = world;
    this.iteration = 10;
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
    this.gravity = new Vector({ x: 0, y: 700 });
    this.rigidBodies = [];
    this.rigidBodies.push(new RigidBody(this.triangle1, 1));
    this.rigidBodies.push(new RigidBody(this.testRectangle1, 1));
    this.rigidBodies.push(new RigidBody(this.testCircle1, 1));
    this.rigidBodies.push(new RigidBody(this.testCircle2, 1));
    this.rigidBodies.push(new RigidBody(this.testRectangle3, 1));
    this.rigidBodies.push(new RigidBody(this.testCircle3, 1));
    this.rigidBodies.push(new RigidBody(this.testRectangle2, 1));
    // this.createTempPyramid();
    this.rigidBodies.push(new RigidBody(this.top, 0));
    this.rigidBodies.push(new RigidBody(this.bottom, 0));
    this.rigidBodies.push(new RigidBody(this.left, 0));
    this.rigidBodies.push(new RigidBody(this.right, 0));

    this.grid = new HashGrid(15);
    this.grid.initialize(this.world, this.rigidBodies);
    this.rigidBodies[0].shape.createAnchor(new Vector({ x: 10, y: -20 }));
  }

  handleJoints() {
    for (let i = 0; i < this.joints.length; i++) {
      //console.log(this.joints[i].jointConnection.anchorA);
      this.joints[i].draw();
      this.joints[i].updateConnectionA();
      this.joints[i].updateConnectionB();
    }
  }

  update = (deltaTime: number) => {
    let fpsText = Math.round(1 / deltaTime) + " FPS";
    this.drawUtils.drawText(new Vector({ x: 10, y: 20 }), 20, "black", fpsText);

    this.grid.refreshGrid();

    this.handleJoints();

    if (this.GrabMouseEvent.grabbedObject) {
      this.GrabMouseEvent.followMouse();
      this.drawUtils.drawPoint(this.GrabMouseEvent.mousePosition, 5, "red");
      let anchorPosition = this.GrabMouseEvent.grabbedObject
        .getShape()
        .anchorPoints.get(this.GrabMouseEvent.grabbedAnchorId);
      if (anchorPosition) {
        this.drawUtils.drawLine(
          this.GrabMouseEvent.mousePosition,
          anchorPosition,
          "black"
        );
      }
    }

    for (let it = 0; it < this.iteration; it++) {
      for (let i = 0; i < this.rigidBodies.length; i++) {
        this.rigidBodies[i].addForce(
          scaleVector(this.gravity, this.rigidBodies[i].mass)
        );
        this.rigidBodies[i].update(deltaTime / this.iteration);
        this.rigidBodies[i].shape.boundingBox.collision = false;
      }
      for (let i = 0; i < this.rigidBodies.length; i++) {
        let objectA = this.rigidBodies[i];
        let neighbors = this.grid.getNeighborObject(i, objectA);
        for (let j = 0; j < neighbors.length; j++) {
          let objectB = neighbors[j];
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
    }
  };

  draw = () => {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].getShape().draw();
      this.rigidBodies[i].shape.calculateBoundingBox();
    }
  };

  clear = () => {
    this.ctx.fillStyle = "white";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  createTempPyramid() {
    let boxSize = 50;
    let iteration = 8;
    let leftOffset = 40;
    let topOffset = this.world.y - iteration * boxSize - 36;
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

  onMouseMove(e: MouseEvent) {
    switch (registry.mouseEventType) {
      case "DRAG":
        this.GrabMouseEvent.mouseMove(e, this.canvas, this);
        break;
      case "JOINT":
        this.JointMouseEvent.mouseMove(e, this.canvas, this);
        break;
    }
  }

  onMouseDown(e: MouseEvent) {
    console.log("mouse  Event Type  :", registry.mouseEventType);
    switch (registry.mouseEventType) {
      case "DRAG":
        this.GrabMouseEvent.mouseDown(e, this.canvas, this);
        break;
      case "JOINT":
        this.JointMouseEvent.mouseDown(e, this.canvas, this);
        break;
    }
  }

  onMouseUp(e: MouseEvent) {
    switch (registry.mouseEventType) {
      case "DRAG":
        this.GrabMouseEvent.mouseUp(e, this.canvas, this);
        break;
      case "JOINT":
        this.JointMouseEvent.mouseUp(e, this.canvas, this);
        break;
    }
  }

  onKeyboardPressed = (e: KeyboardEvent) => {
    switch (e.key) {
      case "d":
        this.rigidBodies[0].addForce(new Vector({ x: 200000, y: 0 }));
        break;
      case "a":
        this.rigidBodies[0].addForce(new Vector({ x: -200000, y: 0 }));
        break;
      case "w":
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: -200000 }));
        break;
      case "s":
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: 200000 }));
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
