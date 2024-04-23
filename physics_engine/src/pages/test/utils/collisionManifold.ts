import Vector, { addVector, scaleVector } from "../lib/vector";
import Draw from "./draw";

export default class CollisionManifold {
  depth: number;
  normal: Vector;
  penetrationPoint: Vector;
  drawUtils: Draw;
  constructor(depth: number, normal: Vector, penetrationPoint: Vector) {
    this.depth = depth;
    this.normal = normal;
    this.penetrationPoint = penetrationPoint;
    this.drawUtils = Draw.getInstance();
  }

  resolveCollision() {}

  positionalCorrection() {}

  draw() {
    const headPosition = addVector(
      this.penetrationPoint,
      scaleVector(this.normal, this.depth * -1)
    );
    this.drawUtils.drawArrow(headPosition, this.penetrationPoint, "blue");
  }
}
