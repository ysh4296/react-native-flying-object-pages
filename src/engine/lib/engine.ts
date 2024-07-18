import Draw from '@engine/utils/draw';
import Rectangle from './rectangle';
import Vector, { addVector, scaleVector } from './vector';
import Calculator from '@engine/utils/calculator';
import Collision from '@engine/utils/collision';
import RigidBody from './rigidbody';
import SpatialGrid from '@engine/optimization/spatialGrid';
import HashGrid from '@engine/optimization/hashGrid';
import GrabMouse from '@engine/event/grabMouse';
import Joint from '@engine/joints/joint';
import { registry } from './main';
import JointMouse from '@engine/event/jointMouse';
import CreateMouse from '@engine/event/createMouse';
import getMousePosition from './getMousePosition';
import Escalator from './block/mover/escalator';
import Grill from './block/mover/grill';
import Food from './food/food';

export default class Engine {
  canvas: HTMLCanvasElement;
  world: Vector;
  ctx: CanvasRenderingContext2D;
  drawUtils: Draw;
  calculatorUtils: Calculator;
  top: Rectangle;
  bottom: Rectangle;
  left: Rectangle;
  right: Rectangle;
  collision: Collision;
  rigidBodies: RigidBody[];
  gravity: Vector;
  iteration: number;
  grid: SpatialGrid;
  GrabMouseEvent: GrabMouse;
  JointMouseEvent: JointMouse;
  CreateMouseEvent: CreateMouse;
  joints: Joint[];
  camera: CameraType;
  pause: boolean;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, world: Vector) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawUtils = Draw.getInstance();
    this.joints = [];
    this.GrabMouseEvent = new GrabMouse();
    this.JointMouseEvent = new JointMouse();
    this.CreateMouseEvent = new CreateMouse();
    this.calculatorUtils = Calculator.getInstance();
    this.collision = Collision.getInstance();
    this.world = world;
    this.iteration = 10;
    this.camera = {
      x: 0,
      y: 0,
      scale: 1,
    };
    this.pause = true;
    this.top = new Rectangle(
      new Vector({ x: this.world.x / 2 - 10, y: 10 }),
      this.world.x - 100,
      20,
      'red',
    );
    this.bottom = new Rectangle(
      new Vector({ x: this.world.x / 2 - 10, y: this.world.y - 10 }),
      this.world.x - 100,
      20,
      'red',
    );
    this.left = new Rectangle(
      new Vector({ x: 10, y: this.world.y / 2 - 10 }),
      20,
      this.world.y - 100,
      'red',
    );
    this.right = new Rectangle(
      new Vector({ x: this.world.x - 10, y: this.world.y / 2 - 10 }),
      20,
      this.world.y - 100,
      'red',
    );
    this.gravity = new Vector({ x: 0, y: 700 });
    this.rigidBodies = [];

    this.rigidBodies.push(new RigidBody(this.top, 0));
    this.rigidBodies.push(new RigidBody(this.bottom, 0));
    this.rigidBodies.push(new RigidBody(this.left, 0));
    this.rigidBodies.push(new RigidBody(this.right, 0));
    this.grid = new HashGrid(15);
    this.grid.initialize(this.world, this.rigidBodies);
    this.grid.refreshGrid();
  }

  handleJoints() {
    for (let i = 0; i < this.joints.length; i++) {
      //console.log(this.joints[i].jointConnection.anchorA);
      this.joints[i].updateConnectionA();
      this.joints[i].updateConnectionB();
    }
  }

  update = (deltaTime: number) => {
    this.grid.draw();
    let fpsText = Math.round(1 / deltaTime) + ' FPS';
    this.drawUtils.drawText(new Vector({ x: 10, y: 20 }), 20, 'black', fpsText);
    // for (let i = 0; i < this.rigidBodies.length; i++) {
    //   if (this.rigidBodies[i] instanceof WaterBlock) {
    //     this.rigidBodies[i].active();
    //   }
    // }

    this.grid.refreshGrid();
    this.handleJoints();

    switch (registry.mouseEventType) {
      case 'DRAG':
        if (this.GrabMouseEvent.grabbedObject) {
          this.GrabMouseEvent.followMouse();
          this.drawUtils.drawPoint(this.GrabMouseEvent.mousePosition, 5, 'red');
          let anchorPosition = this.GrabMouseEvent.grabbedObject
            .getShape()
            .anchorPoints.get(this.GrabMouseEvent.grabbedAnchorId);
          if (anchorPosition) {
            this.drawUtils.drawLine(this.GrabMouseEvent.mousePosition, anchorPosition, 'black');
          }
        }
        break;
      case 'JOINT':
        break;
      case 'CREATE':
        break;
    }

    for (let it = 0; it < this.iteration; it++) {
      for (let i = 0; i < this.rigidBodies.length; i++) {
        this.rigidBodies[i].addForce(scaleVector(this.gravity, this.rigidBodies[i].mass));
        this.rigidBodies[i].update(deltaTime / this.iteration);
        this.rigidBodies[i].shape.boundingBox.collision = false;
      }

      for (let i = 0; i < this.rigidBodies.length; i++) {
        let objectA = this.rigidBodies[i];
        let neighbors = this.grid.getNeighborObject(i, objectA);
        for (let j = 0; j < neighbors.length; j++) {
          let objectB = neighbors[j];

          if (objectA.canCollision(objectB)) {
            if (!objectA.shape.boundingBox.intersect(objectB.shape.boundingBox)) {
              // no collision
              continue;
            }
            let result = this.collision.checkCollision(objectA.shape, objectB.shape);
            if (result) {
              result.resolveCollision(objectA, objectB);
              result.positionalCorrection(objectA, objectB, 0.3);
              // result.draw();
              if (objectB instanceof Escalator) {
                /** objectA moves */
                if (objectA.isKinematic) continue;
                const accelationDirection = this.calculatorUtils.rotateAroundPoint(
                  objectB.direction,
                  new Vector({ x: 0, y: 0 }),
                  objectB.shape.orientation,
                );
                objectA.addForce(
                  scaleVector(
                    new Vector({ x: accelationDirection.x, y: accelationDirection.y }),
                    this.rigidBodies[i].mass,
                  ),
                );
              }
              if (objectB instanceof Grill && objectA instanceof Food) {
                /** objectA cooked */
                objectA.temprature = Math.min(100, objectB.temprature / 6000 + objectA.temprature);
              }
            }
            objectA.shape.boundingBox.collision = true;
            objectB.shape.boundingBox.collision = true;
          }
        }
      }
    }

    for (let i = 0; i < this.rigidBodies.length; i++) {
      if (this.rigidBodies[i] instanceof Food) {
        this.rigidBodies[i].active();
      }
    }
  };

  updateEdit = () => {
    // edit mode
    switch (registry.mouseEventType) {
      case 'DRAG':
        break;
      case 'JOINT':
        break;
      case 'CREATE':
        if (!this.CreateMouseEvent.isEdit) break;
        const start = this.CreateMouseEvent.start;
        const end = this.CreateMouseEvent.mousePosition;
        const width = Math.abs(start.x - end.x);
        const height = Math.abs(start.y - end.y);
        const position = addVector(start, end);
        position.scale(0.5);
        if (registry.createEventType === 'RECTANGLE') {
          this.drawUtils.drawRect(position, new Vector({ x: width, y: height }), 'green');
        }
        if (registry.createEventType === 'CIRCLE') {
          this.drawUtils.drawCircle(position, Math.min(width, height) / 2, 'green');
        }
        break;
    }
    this.grid.refreshGrid();
  };

  draw = () => {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].drawEffect();
    }
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].getShape().draw();
      this.rigidBodies[i].shape.calculateBoundingBox();
    }
    // for (let i = 0; i < this.joints.length; i++) {
    //   this.joints[i].draw();
    // }
  };

  clear = () => {
    this.ctx.fillStyle = 'white';

    this.ctx.clearRect(
      -this.camera.x / this.camera.scale,
      -this.camera.y / this.camera.scale,
      this.canvas.width / this.camera.scale,
      this.canvas.height / this.camera.scale,
    );
  };

  setZoom = () => {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.scale(dpr, dpr);

    this.ctx.save();
    this.ctx.setTransform(this.camera.scale, 0, 0, this.camera.scale, this.camera.x, this.camera.y);
  };

  restoreZoom = () => {
    this.ctx.restore();
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
              'black',
            ),
            1,
          ),
        );
      }
    }
  }

  onMouseMove(e: MouseEvent) {
    switch (registry.mouseEventType) {
      case 'DRAG':
        this.GrabMouseEvent.mouseMove(e, this.canvas, this);
        break;
      case 'JOINT':
        this.JointMouseEvent.mouseMove(e, this.canvas, this);
        break;
      case 'CREATE':
        this.CreateMouseEvent.mouseMove(e, this.canvas, this);
        break;
    }
    const mousePosition = getMousePosition(this.canvas, e);
    for (let i = 0; i < this.rigidBodies.length; i++) {
      if (this.rigidBodies[i].shape.isInside(mousePosition)) {
        this.rigidBodies[i].active();
      }
    }
  }

  onMouseDown(e: MouseEvent) {
    console.log('mouse  Event Type  :', registry.mouseEventType);
    switch (registry.mouseEventType) {
      case 'DRAG':
        this.GrabMouseEvent.mouseDown(e, this.canvas, this);
        break;
      case 'JOINT':
        this.JointMouseEvent.mouseDown(e, this.canvas, this);
        break;
      case 'CREATE':
        this.CreateMouseEvent.mouseDown(e, this.canvas, this);
        break;
    }
  }

  onMouseUp(e: MouseEvent) {
    switch (registry.mouseEventType) {
      case 'DRAG':
        this.GrabMouseEvent.mouseUp(e, this.canvas, this);
        break;
      case 'JOINT':
        this.JointMouseEvent.mouseUp(e, this.canvas, this);
        break;
      case 'CREATE':
        this.CreateMouseEvent.mouseUp(e, this.canvas, this);
        break;
    }
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();

    if (e.ctrlKey) {
      const zoomFactor = 0.1;
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      const wheel = e.deltaY < 0 ? 1 : -1;
      const zoom = Math.exp(wheel * zoomFactor);

      const newScale = this.camera.scale * zoom;

      // 마우스 위치를 기준으로 줌
      this.camera.x = mouseX - (mouseX - this.camera.x) * (newScale / this.camera.scale);
      this.camera.y = mouseY - (mouseY - this.camera.y) * (newScale / this.camera.scale);

      this.camera.scale = newScale;
    } else {
      const moveFactor = 1 / this.camera.scale;
      this.camera.x -= e.deltaX * moveFactor;
      this.camera.y -= e.deltaY * moveFactor;
    }
  }

  onKeyboardPressed = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'd':
        this.rigidBodies[0].addForce(new Vector({ x: 200000, y: 0 }));
        break;
      case 'a':
        this.rigidBodies[0].addForce(new Vector({ x: -200000, y: 0 }));
        break;
      case 'w':
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: -200000 }));
        break;
      case 's':
        this.rigidBodies[0].addForce(new Vector({ x: 0, y: 200000 }));
        break;
      case 'ArrowRight':
        this.rigidBodies[0].shape.rotate(0.05);
        break;
      case 'ArrowLeft':
        this.rigidBodies[0].shape.rotate(-0.05);
        break;
    }
  };
}
