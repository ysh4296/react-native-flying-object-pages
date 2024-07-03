import Engine from "../lib/engine";
import getMousePosition from "../lib/getMousePosition";
import RigidBody from "../lib/rigidbody";
import Vector, { scaleVector, subVector } from "../lib/vector";
import { mouseEvent } from "./mouseEvent";

export default class GrabMouse extends mouseEvent {
  grabbedAnchorId: number;
  grabbedObject: RigidBody | undefined;

  constructor() {
    super();
    this.grabbedAnchorId = 0;
    this.grabbedObject = undefined;
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.mousePosition = getMousePosition(canvas, e);
    let gridId = engine.grid.getCellIdFromPosition(this.mousePosition);
    let objects = engine.grid.getContentOfCell(gridId);
    for (let i = 0; i < objects.length; i++) {
      let mouseInside: boolean = objects[i].shape.isInside(this.mousePosition);
      if (mouseInside) {
        this.isGrab = true;
        this.grabbedObject = objects[i];
        // makes anchor and add to object
        let anchorPosition = subVector(
          this.mousePosition,
          objects[i].shape.centroid
        );
        this.grabbedAnchorId = this.grabbedObject
          .getShape()
          .createAnchor(anchorPosition);
        break;
      }
    }
  }

  mouseUp(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    if (this.grabbedObject) {
      this.grabbedObject.getShape().removeAnchor(this.grabbedAnchorId);

      this.isGrab = false;
      this.grabbedAnchorId = 0;
      this.grabbedObject = undefined;
    }
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    let mousePosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = mousePosition;
  }

  followMouse() {
    if (!this.grabbedObject) return;
    let anchorPosition = this.grabbedObject
      .getShape()
      .anchorPoints.get(this.grabbedAnchorId);
    if (!anchorPosition) return;

    const distanceVector = subVector(anchorPosition, this.mousePosition);
    const distance = distanceVector.length() * 500;

    const mult = 10000 - this.calculatorUtils.clamp(distance, 9750, 100);

    if (distance < 20000) return;

    const force = scaleVector(
      subVector(this.mousePosition, anchorPosition),
      this.grabbedObject.mass * mult
    );

    this.grabbedObject.addForceAtPoint(anchorPosition, force);
  }
}
