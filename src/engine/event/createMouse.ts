import BaconBlock from '@engine/lib/block/baconBlock';
import WaterBlock from '@engine/lib/block/waterBlock';
import Circle from '@engine/lib/circle';
import Engine from '@engine/lib/engine';
import getMousePosition from '@engine/lib/getMousePosition';
import { registry } from '@engine/lib/main';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Vector from '@engine/lib/vector';

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

    if (registry.createEventType === 'RECTANGLE') {
      registry.engine.rigidBodies.push(
        new RigidBody(new Rectangle(center, width, height, 'green'), 1),
      );
    }
    if (registry.createEventType === 'CIRCLE') {
      registry.engine.rigidBodies.push(
        new RigidBody(new Circle(center, Math.min(width, height) / 2, 'green'), 1),
      );
    }
    if (registry.createEventType === 'WATERBLOCK') {
      registry.engine.rigidBodies.push(new WaterBlock(center, width, height, 'blue'));
    }
    if (registry.createEventType === 'BACONBLOCK') {
      registry.engine.rigidBodies.push(new BaconBlock(center, width, height, 'blue'));
    }
    // console.log(registry.engine.rigidBodies);
    this.isEdit = false;
  }
}
