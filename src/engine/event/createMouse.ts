import BaconBlock from '@engine/lib/block/baconBlock';
import BreadBlock from '@engine/lib/block/breadBlock';
import Escalator from '@engine/lib/block/mover/escalator';
import Grill from '@engine/lib/block/mover/grill';
import Spring from '@engine/lib/block/mover/spring';
import WaterBlock from '@engine/lib/block/waterBlock';
import Circle from '@engine/lib/circle';
import Engine from '@engine/lib/engine';
import getMousePosition from '@engine/lib/getMousePosition';
import { registry } from '@engine/lib/main';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Vector from '@engine/lib/vector';
import { assertUnreachableChecker } from '@utils/typeChecker';

export default class CreateMouse {
  start: Vector;
  end: Vector;
  mousePosition: Vector;
  isEdit: boolean;

  constructor() {
    this.start = new Vector({ x: 0, y: 0 });
    this.end = new Vector({ x: 0, y: 0 });
    this.mousePosition = new Vector({ x: 0, y: 0 });
    this.isEdit = false;
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    let mousePosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = mousePosition;
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.start = this.mousePosition;
    this.isEdit = true;
  }

  mouseUp(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.end = this.mousePosition;

    /** create object */
    const width = Math.abs(this.start.x - this.end.x);
    const height = Math.abs(this.start.y - this.end.y);
    const center = new Vector({
      x: (this.start.x + this.end.x) / 2,
      y: (this.start.y + this.end.y) / 2,
    });

    switch (registry.createEventType) {
      case 'NONE':
        break;
      case 'RECTANGLE':
        registry.engine.rigidBodies.push(
          new RigidBody(new Rectangle(center, width, height, 'green'), 1),
        );
        break;
      case 'WATERBLOCK':
        registry.engine.rigidBodies.push(new WaterBlock(center, width, height, 'blue'));
        break;
      case 'CIRCLE':
        registry.engine.rigidBodies.push(
          new RigidBody(new Circle(center, Math.min(width, height) / 2, 'green'), 1),
        );
        break;
      case 'BACONBLOCK':
        registry.engine.rigidBodies.push(new BaconBlock(center, width, height, 'blue'));
        break;
      case 'BREADBLOCK':
        registry.engine.rigidBodies.push(new BreadBlock(center, width, height, 'blue'));
        break;
      case 'ESCALATOR':
        registry.engine.rigidBodies.push(
          new Escalator(center, width, height, 'purple', new Vector({ x: 1, y: 0 }), 50),
        );
        break;
      case 'SPRING':
        registry.engine.rigidBodies.push(new Spring(center, width, height, 'red'));
        break;
      case 'GRILL':
        registry.engine.rigidBodies.push(new Grill(center, width, height, 'red'));
        break;
      default:
        assertUnreachableChecker(registry.createEventType);
    }
    this.isEdit = false;
  }
}
