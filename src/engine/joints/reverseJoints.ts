import { scaleVector, subVector } from "../lib/vector";
import Joint from "./joint";
import JointConnection from "./jointConnection";

export default class ReverseJoint extends Joint {
  strength: number;
  maxLength: number;

  constructor(
    connection: JointConnection,
    strength: number,
    maxLength: number
  ) {
    super(connection);
    this.strength = strength;
    this.maxLength = maxLength;
  }

  updateConnectionA() {
    const anchorAPos = this.getAnchorAPos();
    const anchorBPos = this.getAnchorBPos();

    if (!anchorAPos || !anchorBPos) return;
    const direction = subVector(anchorAPos, anchorBPos);
    const distance = direction.length();
    const force = Math.max(0, this.maxLength - distance);

    direction.normalize();
    this.objectA.addForceAtPoint(
      anchorAPos,
      scaleVector(direction, this.strength * force * 0.5)
    );
  }

  updateConnectionB() {
    const anchorAPos = this.getAnchorAPos();
    const anchorBPos = this.getAnchorBPos();

    if (!anchorAPos || !anchorBPos) return;
    const direction = subVector(anchorBPos, anchorAPos);
    const distance = direction.length();
    const force = Math.max(0, this.maxLength - distance);
    direction.normalize();
    this.objectB.addForceAtPoint(
      anchorBPos,
      scaleVector(direction, this.strength * force * 0.5)
    );
  }
}
