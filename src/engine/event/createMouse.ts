import BaconBlock from '@engine/lib/block/baconBlock';
import BreadBlock from '@engine/lib/block/breadBlock';
import Spring from '@engine/lib/block/mover/spring';
import WaterBlock from '@engine/lib/block/waterBlock';
import Circle from '@engine/lib/circle';
import Engine from '@engine/lib/engine';
import getMousePosition from '@engine/lib/getMousePosition';
import { registry } from '@engine/lib/main';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Vector, { subVector } from '@engine/lib/vector';
import { assertUnreachableChecker } from '@utils/typeChecker';
import Escalators from '@engine/lib/component/escalator';
import Fan from '@engine/lib/component/fan';
import Heater from '@engine/lib/component/heater';

export default class CreateMouse {
  start: Vector;
  end: Vector;
  mousePosition: Vector;
  isEdit: boolean;
  target: RigidBody;
  // for some special creation / ex) escalator
  additionalTarget: Vector;
  additionalTargetSelected: boolean;

  constructor() {
    this.start = new Vector({ x: 0, y: 0 });
    this.end = new Vector({ x: 0, y: 0 });

    this.target = new RigidBody(new Circle(new Vector({ x: 0, y: 0 }), 5, 'black'), 0);
    this.mousePosition = new Vector({ x: 0, y: 0 });
    this.isEdit = false;
    this.additionalTargetSelected = false;
    this.additionalTarget = new Vector({ x: 0, y: 0 });
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    let mousePosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = mousePosition;

    if (this.mousePosition.isOut()) return;
    this.target.shape.move(
      subVector(
        engine.GameBoard.cellIdToCenteroid(
          engine.GameBoard.getCellIdFromPosition(this.mousePosition),
        ),
        this.target.shape.centroid,
      ),
    );
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.start = this.mousePosition;
    this.isEdit = true;

    // centroid 설정에 문제 있을 수 있으나 문제 x
    // react app 과 연계해야함
  }

  mouseUp(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.end = this.mousePosition;

    switch (registry.createEventType) {
      case 'NONE':
        break;
      case 'RECTANGLE':
        registry.engine.rigidBodies.push(
          new RigidBody(
            new Rectangle(
              new Vector(this.target.shape.centroid),
              registry.engine.GameBoard.cellSize,
              registry.engine.GameBoard.cellSize,
              'green',
            ),
            1,
          ),
        );
        break;
      case 'WATERBLOCK':
        registry.engine.rigidBodies.push(
          new WaterBlock(
            new Vector(this.target.shape.centroid),
            registry.engine.GameBoard.cellSize,
            registry.engine.GameBoard.cellSize,
            'blue',
          ),
        );
        break;
      case 'CIRCLE':
        registry.engine.rigidBodies.push(
          new RigidBody(
            new Circle(
              new Vector(this.target.shape.centroid),
              registry.engine.GameBoard.cellSize,
              'green',
            ),
            1,
          ),
        );
        break;
      case 'BACONBLOCK':
        registry.engine.rigidBodies.push(
          new BaconBlock(
            new Vector(this.target.shape.centroid),
            registry.engine.GameBoard.cellSize,
            registry.engine.GameBoard.cellSize,
            'blue',
          ),
        );
        break;
      case 'BREADBLOCK':
        registry.engine.rigidBodies.push(
          new BreadBlock(
            new Vector(this.target.shape.centroid),
            registry.engine.GameBoard.cellSize,
            registry.engine.GameBoard.cellSize,
            'blue',
          ),
        );
        break;
      // case 'ESCALATOR':
      //   registry.engine.rigidBodies.push(
      //     new Escalator(
      //       new Vector(this.target.shape.centroid),
      //       engine.GameBoard.cellSize,
      //       engine.GameBoard.cellSize,
      //       'purple',
      //       new Vector({ x: 1, y: 0 }),
      //       50,
      //     ),
      //   );
      //   break;
      case 'SPRING':
        registry.engine.rigidBodies.push(
          new Spring(
            new Vector(this.target.shape.centroid),
            registry.engine.GameBoard.cellSize,
            registry.engine.GameBoard.cellSize,
            'purple',
          ),
        );
        break;
      case 'HEATER':
        new Heater(this.target.shape.centroid).addComponent();
        break;
      case 'WHEEL':
        if (this.additionalTargetSelected) {
          const creator = new Escalators(this.additionalTarget, this.target.shape.centroid);
          creator.addComponent();
          this.additionalTargetSelected = false;
          break;
        }
        this.additionalTarget = new Vector({ ...this.target.shape.centroid });
        this.additionalTargetSelected = true;
        break;
      case 'FAN':
        new Fan(new Vector(this.target.shape.centroid), (Math.PI / 2) * 3).addComponent();
        break;
      default:
        assertUnreachableChecker(registry.createEventType);
    }
    this.isEdit = false;
  }

  drawCreate() {
    if (this.target.shape.centroid.x === 0 && this.target.shape.centroid.y === 0) return;

    this.target.shape.draw();

    /** blur item */
    registry.engine.drawUtils.fillRect(
      new Vector({
        x: +this.target.shape.centroid.x,
        y: +this.target.shape.centroid.y,
      }),
      new Vector({
        x: registry.engine.GameBoard.cellSize,
        y: registry.engine.GameBoard.cellSize,
      }),
      'rgba(255,255,255,0.6)',
    );
  }
}
