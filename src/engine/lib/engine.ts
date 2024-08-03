import Draw from '@engine/utils/draw';
import Rectangle from '@rigidbody/rectangle';
import Vector, { addVector, scaleVector } from './vector';
import Calculator from '@engine/utils/calculator';
import Collision from '@engine/utils/collision';
import RigidBody from '@rigidbody/rigidbody';
import HashGrid from '@engine/grid/hashGrid';
import GrabMouse from '@engine/event/grabMouse';
import Joint from '@engine/joints/joint';
import { registry } from './main';
import JointMouse from '@engine/event/jointMouse';
import CreateMouse from '@engine/event/createMouse';
import getMousePosition from './getMousePosition';
import EditMouse from '@engine/event/editMouse';
import { assertUnreachableChecker } from '@utils/typeChecker';
import Grid from '@engine/grid/grid';
import Component from './component/component';
import Effect from './effect/effect';

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
  gravity: Vector;
  components: Component[];
  joints: Joint[];
  iteration: number;
  grid: HashGrid;
  GrabMouseEvent: GrabMouse;
  JointMouseEvent: JointMouse;
  CreateMouseEvent: CreateMouse;
  EditMouseEvent: EditMouse;
  camera: CameraType;
  GameBoard: Grid; // gameboard to assign circuit & blocks

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, world: Vector) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawUtils = Draw.getInstance();
    this.joints = [];
    this.GrabMouseEvent = new GrabMouse();
    this.JointMouseEvent = new JointMouse();
    this.CreateMouseEvent = new CreateMouse();
    this.EditMouseEvent = new EditMouse();
    this.calculatorUtils = Calculator.getInstance();
    this.collision = Collision.getInstance();
    this.world = world;
    this.iteration = 10;
    this.camera = {
      x: 0,
      y: 0,
      scale: 1,
    };
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
    this.components = [];
    const component = new Component(this.bottom.centroid);
    const bottom = new RigidBody(this.bottom, 0);
    component.objects.push(bottom);
    // bottom.matter = { friction: 0, restitution: 0 };
    // this.rigidBodies.push(new RigidBody(this.top, 0));
    this.components.push(component);
    // this.rigidBodies.push(new RigidBody(this.left, 0));
    // this.rigidBodies.push(new RigidBody(this.right, 0));
    this.grid = new HashGrid(15);
    this.grid.initialize(this.world, [], this.components);
    this.grid.refreshGrid();
    this.GameBoard = new Grid(100);
    this.GameBoard.initialize(this.world, []);
  }

  handleJoints() {
    for (let i = 0; i < this.joints.length; i++) {
      this.joints[i].updateConnectionA();
      this.joints[i].updateConnectionB();
    }
  }

  update = (deltaTime: number) => {
    let fpsText = Math.round(1 / deltaTime) + ' FPS';
    deltaTime = 1 / 60;
    this.drawUtils.drawText(
      new Vector({
        x: (-this.camera.x + 10) / this.camera.scale,
        y: (-this.camera.y + this.canvas.height - 100) / this.camera.scale,
      }),
      20 / this.camera.scale,
      'black',
      fpsText,
    );
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
      this.components.forEach((component: Component) => {
        for (let i = 0; i < component.objects.length; i++) {
          let objectA = component.objects[i];
          objectA.addForce(scaleVector(this.gravity, objectA.mass));
          objectA.update(deltaTime / this.iteration);
          objectA.shape.boundingBox.collision = false;
        }
      });

      this.components.forEach((component: Component) => {
        for (let i = 0; i < component.objects.length; i++) {
          let objectA = component.objects[i];
          const objectCode: ObjectCode = `${component.id}:${component.objects[i].id}`;

          let neighbors = this.grid.getNeighborObject(objectCode, objectA);
          for (let j = 0; j < neighbors.length; j++) {
            let objectB = neighbors[j];
            if (objectB instanceof Effect) {
              continue;
            }
            if (objectA.canCollision(objectB)) {
              if (!objectA.shape.boundingBox.intersect(objectB.shape.boundingBox)) {
                // no collision
                continue;
              }
              let result = this.collision.checkCollision(objectA.shape, objectB.shape);
              if (result) {
                /** resolve collision */
                result.resolveCollision(objectA, objectB);
                result.positionalCorrection(objectA, objectB, 0.3);
              }
              objectA.shape.boundingBox.collision = true;
              objectB.shape.boundingBox.collision = true;
            }
          }
        }
      });
    }

    this.components.forEach((component: Component) => {
      for (let i = 0; i < component.objects.length; i++) {
        let objectA = component.objects[i];
        const objectCode: ObjectCode = `${component.id}:${component.objects[i].id}`;

        let neighbors = this.grid.getNeighborObject(objectCode, objectA);
        objectA.addForce(scaleVector(this.gravity, objectA.mass));
        objectA.update(deltaTime / this.iteration);
        objectA.shape.boundingBox.collision = false;
        for (let j = 0; j < neighbors.length; j++) {
          let effectB = neighbors[j];
          if (effectB instanceof Effect) {
            if (objectA.canCollision(effectB)) {
              if (!objectA.shape.boundingBox.intersect(effectB.shape.boundingBox)) {
                // no collision
                continue;
              }
              let result = this.collision.checkCollision(objectA.shape, effectB.shape);
              if (result) {
                /** apply effect */
                effectB.applyEffect(objectA);
              }
              objectA.shape.boundingBox.collision = true;
              effectB.shape.boundingBox.collision = true;
            }
          }
        }
      }
    });

    // for (let it = 0; it < this.iteration; it++) {
    //   for (let i = 0; i < this.rigidBodies.length; i++) {
    //     this.rigidBodies[i].addForce(scaleVector(this.gravity, this.rigidBodies[i].mass));
    //     this.rigidBodies[i].update(deltaTime / this.iteration);
    //     this.rigidBodies[i].shape.boundingBox.collision = false;
    //   }

    //   for (let i = 0; i < this.rigidBodies.length; i++) {
    //     let objectA = this.rigidBodies[i];
    //     let neighbors = this.grid.getNeighborObject(i, objectA);
    //     for (let j = 0; j < neighbors.length; j++) {
    //       let objectB = neighbors[j];

    //       if (objectA.canCollision(objectB)) {
    //         if (!objectA.shape.boundingBox.intersect(objectB.shape.boundingBox)) {
    //           // no collision
    //           continue;
    //         }
    //         let result = this.collision.checkCollision(objectA.shape, objectB.shape);
    //         if (result) {
    //           result.resolveCollision(objectA, objectB);
    //           result.positionalCorrection(objectA, objectB, 0.3);

    //           // if (objectB instanceof Spring) {
    //           //   /** objectA moves */
    //           //   if (objectA.isKinematic) continue;
    //           //   if (objectB.counter === 0) {
    //           //     objectA.addVelocity(scaleVector(objectB.direction, objectB.springConstant));
    //           //   }
    //           // }
    //         }
    //         objectA.shape.boundingBox.collision = true;
    //         objectB.shape.boundingBox.collision = true;
    //       }
    //     }
    //   }
    // }

    this.components.forEach((component: Component) => {
      component.objects.forEach((object) => {
        object.active();
      });
    });

    /** erase outted objects */
    this.components.forEach((component: Component) => {
      component.objects.forEach((object, index) => {
        if (!object.isKinematic) {
          if (object.shape.centroid.isOut()) {
            this.joints = this.joints.filter(
              (item) =>
                item.jointConnection.objectAId !== object.id &&
                item.jointConnection.objectBId !== object.id,
            );
            component.objects.splice(index, 1);
          }
        }
      });
    });
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
        if (registry.createEventType === 'BACONBLOCK') {
          this.drawUtils.drawRect(position, new Vector({ x: width, y: height }), 'green');
        }
        if (registry.createEventType === 'BREADBLOCK') {
          this.drawUtils.drawRect(position, new Vector({ x: width, y: height }), 'green');
        }
        // if (registry.createEventType === 'ESCALATOR') {
        //   this.drawUtils.drawRect(position, new Vector({ x: width, y: height }), 'green');
        // }
        if (registry.createEventType === 'CIRCLE') {
          this.drawUtils.drawCircle(position, Math.min(width, height) / 2, 'green');
        }
        break;
    }
    this.grid.refreshGrid();
  };

  draw() {
    if (registry.mouseEventType === 'CREATE') this.CreateMouseEvent.drawCreate();
    if (registry.gamePhase === 'pause') this.GameBoard.draw();
    this.components.forEach((component) => {
      component.drawComponent();
      component.objects.forEach((object) => {
        object.shape.calculateBoundingBox();
      });
    });
    this.components.forEach((component) => {
      component.drawEffect();
    });

    // for (let i = 0; i < this.rigidBodies.length; i++) {
    //   this.rigidBodies[i].drawEffect();
    // }
    // for (let i = 0; i < this.rigidBodies.length; i++) {
    //   this.rigidBodies[i].getShape().draw();
    //   this.rigidBodies[i].shape.calculateBoundingBox();
    // }
    for (let i = 0; i < this.joints.length; i++) {
      this.joints[i].draw();
    }
    // for (let i = 0; i < this.effects.length; i++) {
    //   this.effects[i].drawEffect();
    // }
  }

  drawSelect() {
    this.EditMouseEvent.drawSelect();
  }

  clear() {
    this.ctx.fillStyle = 'white';

    this.ctx.clearRect(
      -this.camera.x / this.camera.scale,
      -this.camera.y / this.camera.scale,
      this.canvas.width / this.camera.scale,
      this.canvas.height / this.camera.scale,
    );
  }

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
        let component = new Component(new Vector({ x: x + leftOffset, y: y + topOffset }));
        component.objects.push(
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
        this.components.push(component);
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
      case 'EDIT':
        this.EditMouseEvent.mouseMove(e, this.canvas, this);
        break;
      case 'NONE':
        break;
      default:
        return assertUnreachableChecker(registry.mouseEventType);
    }
    // const mousePosition = getMousePosition(this.canvas, e);
    // for (let i = 0; i < this.rigidBodies.length; i++) {
    //   if (this.rigidBodies[i].shape.isInside(mousePosition)) {
    //     this.rigidBodies[i].active();
    //   }
    // }
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
      case 'EDIT':
        this.EditMouseEvent.mouseDown(e, this.canvas, this);
        break;
      case 'NONE':
        const mousePosition = getMousePosition(this.canvas, e);
        for (let i = 0; i < this.components.length; i++) {
          if (this.components[i].isInside(mousePosition)) {
            this.components[i].select();
            registry.setMouseEventType('EDIT');
          }
        }
        // for (let i = 0; i < this.rigidBodies.length; i++) {
        //   if (this.rigidBodies[i].shape.isInside(mousePosition)) {
        //     this.rigidBodies[i].select();
        //     registry.setMouseEventType('EDIT');
        //   }
        // }
        break;
      default:
        return assertUnreachableChecker(registry.mouseEventType);
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
      case 'EDIT':
        this.EditMouseEvent.mouseUp(e, this.canvas, this);
        break;
      case 'NONE':
        break;
      default:
        return assertUnreachableChecker(registry.mouseEventType);
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
    // switch (e.key) {
    //   case 'd':
    //     this.rigidBodies[0].addForce(new Vector({ x: 200000, y: 0 }));
    //     break;
    //   case 'a':
    //     this.rigidBodies[0].addForce(new Vector({ x: -200000, y: 0 }));
    //     break;
    //   case 'w':
    //     this.rigidBodies[0].addForce(new Vector({ x: 0, y: -200000 }));
    //     break;
    //   case 's':
    //     this.rigidBodies[0].addForce(new Vector({ x: 0, y: 200000 }));
    //     break;
    //   case 'ArrowRight':
    //     this.rigidBodies[0].shape.rotate(0.05);
    //     break;
    //   case 'ArrowLeft':
    //     this.rigidBodies[0].shape.rotate(-0.05);
    //     break;
    // }
  };
}
