import Engine from '@engine/lib/engine';
import RigidBody from '@rigidbody/rigidbody';
import Vector from '@engine/lib/vector';
import Calculator from '@engine/utils/calculator';

export class mouseEvent {
  isGrab: boolean;
  grabbedObject: RigidBody | undefined;
  mousePosition: Vector;
  calculatorUtils: Calculator;
  constructor() {
    this.isGrab = false;
    this.mousePosition = new Vector({ x: 0, y: 0 });
    this.calculatorUtils = Calculator.getInstance();
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    return;
  }

  mouseUp(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    return;
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    return;
  }

  followMouse() {
    return;
  }
}
