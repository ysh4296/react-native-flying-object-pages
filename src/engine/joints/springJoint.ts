import { scaleVector, subVector } from '@engine/lib/vector';
import Joint from './joint';
import JointConnection from './jointConnection';

export default class SpringJoint extends Joint {
  springConstant: number;
  restLength: number;

  constructor(connection: JointConnection, springConstant: number, restLength: number) {
    super(connection);
    this.springConstant = springConstant;
    this.restLength = restLength;
  }

  updateConnectionA() {
    const anchorAPos = this.getAnchorAPos();
    const anchorBPos = this.getAnchorBPos();

    if (!anchorAPos || !anchorBPos) return;
    const direction = subVector(anchorAPos, anchorBPos);
    const distance = direction.length();
    direction.normalize();
    const leftDistance = distance - this.restLength;
    this.jointConnection.changeColor(leftDistance);
    const force = leftDistance * this.restLength * this.springConstant;
    this.objectB.addForceAtPoint(anchorBPos, scaleVector(direction, force));
  }

  updateConnectionB() {
    const anchorAPos = this.getAnchorAPos();
    const anchorBPos = this.getAnchorBPos();

    if (!anchorAPos || !anchorBPos) return;
    const direction = subVector(anchorBPos, anchorAPos);
    const distance = direction.length();
    direction.normalize();
    const leftDistance = distance - this.restLength;
    this.jointConnection.changeColor(leftDistance);
    const force = leftDistance * this.restLength * this.springConstant;
    this.objectA.addForceAtPoint(anchorAPos, scaleVector(direction, force));
  }
}
