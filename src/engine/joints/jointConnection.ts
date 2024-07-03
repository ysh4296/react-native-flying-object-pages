import RigidBody from "@engine/lib/rigidbody";
import Draw from "@engine/utils/draw";

export default class JointConnection {
  objectA: RigidBody;
  objectB: RigidBody;
  anchorAId: number;
  anchorBId: number;
  color: string;
  drawUtils: Draw;

  constructor(
    objectA: RigidBody,
    anchorAId: number,
    objectB: RigidBody,
    anchorBId: number
  ) {
    this.objectA = objectA;
    this.anchorAId = anchorAId;
    this.objectB = objectB;
    this.anchorBId = anchorBId;
    this.color = "green";
    this.drawUtils = Draw.getInstance();
  }

  draw() {
    const start = this.objectA.getShape().anchorPoints.get(this.anchorAId);
    const end = this.objectB.getShape().anchorPoints.get(this.anchorBId);
    if (start && end) {
      this.drawUtils.drawLine(start, end, this.color);
    }
  }

  changeColor(distance: number) {
    if (distance < 50) {
      this.color = "red";
    } else if (distance < 100) {
      this.color = "green";
    } else {
      this.color = "blue";
    }
  }
}
