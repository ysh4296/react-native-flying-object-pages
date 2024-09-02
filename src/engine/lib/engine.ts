import Draw from '@engine/utils/draw';
import Vector, { addVector, scaleVector, subVector } from './vector';
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
import CollisionCache from '@engine/utils/collisionCache';
import DamageText from '@engine/utils/damageText';
import Rectangle from '@rigidbody/rectangle';
import Monster from './component/defense/monster';
import ParticleEffects from '@engine/utils/particleEffects';
import GoldGainEffect from '@engine/utils/goldGainEffect';
import skillEffects from '@engine/utils/skillEffects';
import Charactor from './game/charactor';
import BoundingBox from '@engine/grid/boundingBox';
import { BounceAttribute } from './game/attribute/attribute';
// import { Engine as rustEngine } from '../../../rust-module/pkg/rust_module';

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
  objects: RigidBody[];
  joints: Joint[];
  iteration: number;
  grid: HashGrid;
  GrabMouseEvent: GrabMouse;
  JointMouseEvent: JointMouse;
  CreateMouseEvent: CreateMouse;
  EditMouseEvent: EditMouse;
  camera: CameraType;
  GameBoard: Grid; // gameboard to assign circuit & blocks
  // rustEngine: rustEngine;
  gravity: Vector;
  collisionCache: CollisionCache;
  damageText: DamageText;
  particleEffect: ParticleEffects;
  goldGainEffect: GoldGainEffect;
  skillEffect: skillEffects;
  charactorMap: Map<number, Charactor>;

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
    this.gravity = new Vector({ x: 0, y: 700 });
    this.charactorMap = new Map();
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
      new Vector({ x: this.world.x / 2 - 10, y: this.world.y - 100 }),
      this.world.x - 300,
      100,
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
    this.objects = [];
    const bottom = new RigidBody(this.bottom, 0);
    this.objects.push(bottom);
    const top = new RigidBody(this.top, 0);
    this.objects.push(top);
    const right = new RigidBody(this.right, 0);
    this.objects.push(right);
    const left = new RigidBody(this.left, 0);
    this.objects.push(left);
    this.grid = new HashGrid(15);
    this.skillEffect = new skillEffects();
    this.grid.initializeComponent(this.world, this.objects, this.skillEffect.active);
    this.grid.refreshGrid(this.objects, this.skillEffect.active);
    this.GameBoard = new Grid(100);
    this.GameBoard.initialize(this.world);
    // this.rustEngine = new rustEngine();
    this.collisionCache = new CollisionCache(6);
    this.damageText = new DamageText();
    this.particleEffect = new ParticleEffects();
    this.goldGainEffect = new GoldGainEffect();
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

    this.charactorMap.forEach((charactor) => charactor.update());

    this.skillEffect.update();

    this.grid.refreshGrid(this.objects, this.skillEffect.active);
    this.handleJoints();

    // this.rustEngine.update(deltaTime);

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
      this.objects.forEach((object: RigidBody) => {
        object.addForce(scaleVector(this.gravity, object.mass));
        object.update(deltaTime / this.iteration);
      });

      this.objects.forEach((object: RigidBody) => {
        object.shape.boundingBox.collision = false;
        let neighbors = this.grid.getNeighborObject(object);

        for (let j = 0; j < neighbors.length; j++) {
          let neighbor = neighbors[j];
          if (object.canCollision(neighbor)) {
            if (!object.shape.boundingBox.intersect(neighbor.shape.boundingBox)) {
              // no collision
              continue;
            }

            let result = this.collision.checkCollision(object.shape, neighbor.shape);
            if (result) {
              /** resolve collision */
              // hard crashed

              if (result.depth > 1) {
                // depth mostly between 3 ~ 12
                this.collisionCache.onCollision(result, object, neighbor);
              }

              result.resolveCollision(object, neighbor);
              result.positionalCorrection(object, neighbor, 0.3);
            }
            object.shape.boundingBox.collision = true;
            object.shape.boundingBox.collision = true;
          }
        }
      });
    }

    this.skillEffect.active.forEach((skillFrame) => {
      skillFrame.frame.effectRanges.forEach((effectRange) => {
        const neighbors = this.grid.getNeighborSkill(effectRange);
        effectRange.boundingBox.collision = false;
        /**
         * frame은 스킬의 원형으로 boundingbox가 user의 현위치를 고려하지 않고 계산되고 있습니다.
         * skill frame과 user를 통해 충돌 확인 로직을 구현해야 합니다.
         */
        const userSkillFrame = new BoundingBox();
        userSkillFrame.topLeft = addVector(
          effectRange.boundingBox.topLeft,
          skillFrame.user.object.shape.centroid,
        );
        userSkillFrame.bottomRight = addVector(
          effectRange.boundingBox.bottomRight,
          skillFrame.user.object.shape.centroid,
        );

        for (let i = 0; i < neighbors.length; i++) {
          let object = neighbors[i];
          if (object.id === skillFrame.user.object.id) {
            continue;
          }
          if (object.isKinematic) continue;
          if (!object.shape.boundingBox.intersect(userSkillFrame)) {
            // no collision
            continue;
          }
          const userEffectShape = new Rectangle(skillFrame.user.object.shape.centroid, 0, 0, '');
          userEffectShape.vertices = [];
          userEffectShape.normals = [];
          effectRange.vertices.forEach((v) => {
            userEffectShape.vertices.push(new Vector(v));
          });

          effectRange.normals.forEach((v) => {
            userEffectShape.normals.push(new Vector(v));
          });

          userEffectShape.centroid = new Vector(effectRange.centroid);

          userEffectShape.move(skillFrame.user.object.shape.centroid);

          let result = this.collision.checkCollision(object.shape, userEffectShape);
          if (result) {
            /** skill applied */

            // this.collisionCache.hasCooldownPassed(object.id, skillFrame.user.id);

            skillFrame.skill.attributes.forEach((attribute) => {
              if (attribute instanceof BounceAttribute) {
                if (object.id !== skillFrame.user.object.id) {
                  attribute.apply(object);
                  if (result) {
                    //Skill Cache를 따로 생성하고 {캐릭터} {스킬 id} 의 형태로 스킬 적용캐시를 생성해야 함
                    this.collisionCache.onCollision(result, object, skillFrame.user.object, 4);
                  }
                }
              }
            });
          }
          object.shape.boundingBox.collision = true;
          effectRange.boundingBox.collision = true;
        }
      });
    });

    const eraseIndex: number[] = [];
    /** reset position for outted objects */
    this.objects.forEach((object: RigidBody, componentIndex: number) => {
      if (object instanceof Monster) {
        if (object.hp < 0) {
          // dead!
          this.particleEffect.createExplosion(object.shape.centroid, 30);
          this.particleEffect.createBlinking(object.shape.centroid);
          this.goldGainEffect.addGlodGainText(
            object.shape.centroid.x,
            object.shape.centroid.y,
            1000,
          );
          eraseIndex.push(componentIndex);
        }
      }
    });

    // eraseIndex를 내림차순으로 정렬
    eraseIndex.sort((a, b) => b - a);

    // 인덱스가 큰 것부터 순서대로 삭제
    eraseIndex.forEach((index) => {
      this.objects.splice(index, 1);
    });

    this.objects.forEach((object: RigidBody) => {
      if (!object.isKinematic) {
        if (object.shape.centroid.isOut()) {
          const toStartPoint = subVector(new Vector({ x: 400, y: 100 }), object.shape.centroid);
          object.shape.move(toStartPoint);

          object.velocity = new Vector({ x: 0, y: 0 });
        }
      }
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
        if (registry.createEventType === 'CIRCLE') {
          this.drawUtils.drawCircle(position, Math.min(width, height) / 2, 'green');
        }
        break;
    }
    this.grid.refreshGrid(this.objects, this.skillEffect.active);
  };

  draw() {
    if (registry.mouseEventType === 'CREATE') this.CreateMouseEvent.drawCreate();
    if (registry.gamePhase === 'pause') this.GameBoard.draw();
    this.objects.forEach((object) => {
      object.shape.draw();
      object.shape.calculateBoundingBox();
      object.shape.boundingBox.draw();
    });
    this.objects.forEach((component) => {
      component.drawEffect();
    });

    // const particlesPtr = this.rustEngine.particles();
    // const cells = new Float64Array(registry.memory.buffer, particlesPtr, 1600 * 7);

    // for (let i = 0; i < 1600 * 7; i += 7) {
    //   // i is index of particle
    //   // cells[i]; // positionx
    //   // cells[i + 1]; // positiony
    //   // cells[i + 2]; // prevx
    //   // cells[i + 3]; // prevy
    //   // cells[i + 4]; // velox
    //   // cells[i + 5]; // veloy

    //   this.drawUtils.fillCircle(new Vector({ x: cells[i + 1], y: cells[i + 2] }), 5, 'blue');
    // }
    // registry.sprite.drawSprite();

    this.skillEffect.active.forEach((skillFrame) => {
      skillFrame.frame.effectRanges.forEach((effectRange) => {
        effectRange.calculateBoundingBox();
        const { centroid } = skillFrame.user.object.shape;
        this.drawUtils.ctx.save();
        this.drawUtils.ctx.translate(centroid.x, centroid.y);
        effectRange.boundingBox.draw();
        this.drawUtils.ctx.restore();
      });
    });

    this.skillEffect.draw();
    this.particleEffect.update();
    this.particleEffect.draw();
    this.goldGainEffect.updateAndDrawGlodGainTexts();
    this.damageText.updateAndDrawDamageTexts();
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
        for (let i = 0; i < this.objects.length; i++) {
          if (this.objects[i].shape.isInside(mousePosition)) {
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
    /**
     * key board press event
     */
  };
}
