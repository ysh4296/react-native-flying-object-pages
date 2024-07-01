import SpringJoint from "../joints/springJoint";
import JointConnection from "../joints/jointConnection";
import Engine from "../lib/engine";
import getMousePosition from "../lib/getMousePosition";
import { registry } from "../lib/main";
import RigidBody from "../lib/rigidbody";
import Vector, { subVector } from "../lib/vector";
import { mouseEvent } from "./mouseEvent";
import ForceJoint from "../joints/forceJoint";
import ReverseJoint from "../joints/reverseJoints";

export default class JointMouse extends mouseEvent {
  grabbedAnchorAId: number;
  grabbedObjectA: RigidBody | undefined;
  grabbedAnchorBId: number;
  grabbedObjectB: RigidBody | undefined;

  constructor() {
    super();
    this.grabbedAnchorAId = 0;
    this.grabbedObjectA = undefined;
    this.grabbedAnchorBId = 0;
    this.grabbedObjectB = undefined;
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.mousePosition = getMousePosition(canvas, e);
    let gridId = engine.grid.getCellIdFromPosition(this.mousePosition);
    let objects = engine.grid.getContentOfCell(gridId);
    for (let i = 0; i < objects.length; i++) {
      let mouseInside: boolean = objects[i].shape.isInside(this.mousePosition);
      if (mouseInside) {
        this.isGrab = true;
        this.grabbedObjectA = objects[i];
        // makes anchor and add to object
        let anchorPosition = subVector(
          this.mousePosition,
          objects[i].shape.centroid
        );
        this.grabbedAnchorAId = this.grabbedObjectA
          .getShape()
          .createAnchor(anchorPosition);
        break;
      }
    }
  }

  mouseUp(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.mousePosition = getMousePosition(canvas, e);
    let gridId = engine.grid.getCellIdFromPosition(this.mousePosition);
    let objects = engine.grid.getContentOfCell(gridId);
    for (let i = 0; i < objects.length; i++) {
      let mouseInside: boolean = objects[i].shape.isInside(this.mousePosition);
      if (mouseInside) {
        this.isGrab = true;
        this.grabbedObjectB = objects[i];
        // makes anchor and add to object
        let anchorPosition = subVector(
          this.mousePosition,
          objects[i].shape.centroid
        );
        this.grabbedAnchorBId = this.grabbedObjectB
          .getShape()
          .createAnchor(anchorPosition);
        break;
      }
    }

    if (this.grabbedObjectA && this.grabbedObjectB) {
      let jointConnection = new JointConnection(
        this.grabbedObjectA,
        this.grabbedAnchorAId,
        this.grabbedObjectB,
        this.grabbedAnchorBId
      );

      console.log("joint  Event Type  :", registry.jointEventType);
      switch (registry.jointEventType) {
        case "NONE":
          return;
        case "FORCE":
          registry.engine.joints.push(new ForceJoint(jointConnection, 500000));
          break;
        case "SPRING":
          registry.engine.joints.push(new SpringJoint(jointConnection, 10, 50));
          break;
        case "REVERSE":
          registry.engine.joints.push(
            new ReverseJoint(jointConnection, 100, 400)
          );
          break;
      }
    } else {
      if (this.grabbedObjectA) {
        this.grabbedObjectA.getShape().removeAnchor(this.grabbedAnchorAId);
      }
      if (this.grabbedObjectB) {
        this.grabbedObjectB.getShape().removeAnchor(this.grabbedAnchorBId);
      }
    }
    this.grabbedAnchorAId = 0;
    this.grabbedObjectA = undefined;
    this.grabbedAnchorBId = 0;
    this.grabbedObjectB = undefined;
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    let mousePosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = mousePosition;
  }
}
