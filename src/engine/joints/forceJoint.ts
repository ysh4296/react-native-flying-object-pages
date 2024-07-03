import { scaleVector, subVector } from "../lib/vector";
import Joint from "./joint";
import JointConnection from "./jointConnection";

export default class ForceJoint extends Joint {
  strength: number;

  constructor(connection: JointConnection, strength: number) {
    super(connection);
    this.strength = strength;
  }

  updateConnectionA() {
    const anchorAPos = this.getAnchorAPos();
    const anchorBPos = this.getAnchorBPos();

    if (!anchorAPos || !anchorBPos) return;
    const direction = subVector(anchorAPos, anchorBPos);
    direction.normalize();
    this.objectB.addForceAtPoint(
      anchorBPos,
      scaleVector(direction, this.strength * 0.5)
    );
  }

  updateConnectionB() {
    const anchorAPos = this.getAnchorAPos();
    const anchorBPos = this.getAnchorBPos();

    if (!anchorAPos || !anchorBPos) return;
    const direction = subVector(anchorBPos, anchorAPos);
    direction.normalize();
    this.objectA.addForceAtPoint(
      anchorAPos,
      scaleVector(direction, this.strength * 0.5)
    );
  }
}
