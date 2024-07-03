import SpringJoint from '@engine/joints/springJoint';
import JointConnection from '@engine/joints/jointConnection';
import Engine from '@engine/lib/engine';
import getMousePosition from '@engine/lib/getMousePosition';
import { registry } from '@engine/lib/main';
import RigidBody from '@engine/lib/rigidbody';
import Vector, { subVector } from '@engine/lib/vector';
import { mouseEvent } from './mouseEvent';
import ForceJoint from '@engine/joints/forceJoint';
import ReverseJoint from '@engine/joints/reverseJoints';
import FixedJoint from '@engine/joints/fixedJoint';
import HingeJoint from '@engine/joints/hingeJoint';

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
        let anchorPosition = subVector(this.mousePosition, objects[i].shape.centroid);
        this.grabbedAnchorAId = this.grabbedObjectA.getShape().createAnchor(anchorPosition);
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
        let anchorPosition = subVector(this.mousePosition, objects[i].shape.centroid);
        this.grabbedAnchorBId = this.grabbedObjectB.getShape().createAnchor(anchorPosition);
        break;
      }
    }

    if (this.grabbedObjectA && this.grabbedObjectB) {
      let jointConnection = new JointConnection(
        this.grabbedObjectA,
        this.grabbedAnchorAId,
        this.grabbedObjectB,
        this.grabbedAnchorBId,
      );

      switch (registry.jointEventType) {
        case 'NONE':
          return;
        case 'FORCE':
          registry.engine.joints.push(new ForceJoint(jointConnection, 5000));
          break;
        case 'SPRING':
          registry.engine.joints.push(new SpringJoint(jointConnection, 10, 50));
          break;
        case 'REVERSE':
          registry.engine.joints.push(new ReverseJoint(jointConnection, 100, 400));
          break;
        case 'FIXED':
          registry.engine.joints.push(new FixedJoint(jointConnection));
          break;
        case 'HINGE':
          registry.engine.joints.push(new HingeJoint(jointConnection));
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
