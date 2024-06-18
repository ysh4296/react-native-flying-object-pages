import Engine from "../lib/engine";
import getMousePosition from "../lib/getMousePosition";
import RigidBody from "../lib/rigidbody";
import Vector, { scaleVector, subVector } from "../lib/vector";
import Draw from "../utils/draw";

export default class Mouse {
  isGrab: boolean;
  grabbedAnchorId: number;
  grabbedObject: RigidBody | undefined;
  drawUtils: Draw;
  mousePosition: Vector;

  constructor() {
    this.isGrab = false;
    this.grabbedAnchorId = 0;
    this.grabbedObject = undefined;
    this.drawUtils = Draw.getInstance();
    this.mousePosition = new Vector({ x: 0, y: 0 });
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    console.log("mouseDown");
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
    console.log("mouseUP");
    if (this.grabbedObject) {
      this.grabbedObject.getShape().removeAnchor(this.grabbedAnchorId);

      this.isGrab = false;
      this.grabbedAnchorId = 0;
      this.grabbedObject = undefined;
    }
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    // if (!this.grabbedObject) return;
    let mousePosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = mousePosition;
  }

  followMouse() {
    if (!this.grabbedObject) return;
    let anchorPosition = this.grabbedObject
      .getShape()
      .anchorPoints.get(this.grabbedAnchorId);
    if (!anchorPosition) return;
    let force = scaleVector(
      subVector(this.mousePosition, anchorPosition),
      this.grabbedObject.mass * 1000
    );
    this.grabbedObject.addForceAtPoint(anchorPosition, force);
  }
}
