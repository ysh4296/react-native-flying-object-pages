import RigidBody from "../lib/rigidbody";
import Vector, { addVector, scaleVector, subVector } from "../lib/vector";
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

  resolveCollision(objectA: RigidBody, objectB: RigidBody) {
    // 부딧혔다면 상대속도를 통해 충돌을 해결한다.
    let relativeVelocity = subVector(objectB.velocity, objectA.velocity);
    let velocityDotCollision = relativeVelocity.getDotProduct(this.normal);
    if (velocityDotCollision > 0) {
      return;
    }

    if (objectA.isKinematic && objectB.isKinematic) {
      return;
    }

    let massInverseSum = objectA.massInverse + objectB.massInverse;
    // 반발계수는 bounce를 통해 계산 가능
    let collisionRestitution =
      (2 * objectA.matter.bounce * objectB.matter.bounce) /
      (objectA.matter.bounce + objectB.matter.bounce);
    let j = -(1 + collisionRestitution) * velocityDotCollision;
    j /= massInverseSum;

    let impulseCollision = scaleVector(this.normal, j);
    let impulseVectorA = scaleVector(
      impulseCollision,
      -1 * objectA.massInverse
    );
    let impulseVectorB = scaleVector(impulseCollision, objectB.massInverse);
    objectA.velocity = addVector(objectA.velocity, impulseVectorA);
    objectB.velocity = addVector(objectB.velocity, impulseVectorB);
  }

  positionalCorrection(objectA: RigidBody, objectB: RigidBody) {
    let correctDelta = 1.5;
    let correction =
      (this.depth / (objectA.massInverse + objectB.massInverse)) * correctDelta;

    let correctVector = scaleVector(this.normal, correction);
    let correctMoveA = scaleVector(correctVector, objectA.massInverse * -1);
    let correctMoveB = scaleVector(correctVector, objectB.massInverse);
    if (!objectA.isKinematic) {
      objectA.getShape().move(correctMoveA);
    }
    if (!objectB.isKinematic) {
      objectB.getShape().move(correctMoveB);
    }
  }

  draw() {
    const headPosition = addVector(
      this.penetrationPoint,
      scaleVector(this.normal, this.depth * -1)
    );
    this.drawUtils.drawArrow(headPosition, this.penetrationPoint, "blue");

    this.drawUtils.drawPoint(this.penetrationPoint, 3, "gray");
  }
}
