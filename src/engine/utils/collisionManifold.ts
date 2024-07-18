import RigidBody from '@engine/lib/rigidbody';
import Vector, { addVector, scaleVector, subVector } from '@engine/lib/vector';
import Draw from './draw';

export default class CollisionManifold {
  depth: number;
  normal: Vector;
  penetrationPoint: Vector;
  drawUtils: Draw;
  flipNormalEnabled: boolean;
  constructor(depth: number, normal: Vector, penetrationPoint: Vector) {
    this.depth = depth;
    this.normal = normal;
    this.penetrationPoint = penetrationPoint;
    this.drawUtils = Draw.getInstance();
    this.flipNormalEnabled = true;
  }

  flip() {
    if (this.flipNormalEnabled) {
      this.normal = scaleVector(this.normal, -1);
    }
  }

  resolveCollision(objectA: RigidBody, objectB: RigidBody) {
    // 부딧혔다면 상대속도를 통해 충돌을 해결한다.
    if (objectA.isKinematic && objectB.isKinematic) {
      return;
    }

    let dir = subVector(objectB.shape.centroid, objectA.shape.centroid);
    if (dir.getDotProduct(this.normal) < 0) {
      this.flip();
    }

    let minRestitution = Math.min(objectA.matter.restitution, objectB.matter.restitution);

    let minFriction = Math.min(objectA.matter.friction, objectB.matter.friction);

    let penetrationPointToCentroidA = subVector(this.penetrationPoint, objectA.shape.centroid);

    let penetrationPointToCentroidB = subVector(this.penetrationPoint, objectB.shape.centroid);

    let angularVelocityA = new Vector({
      x: -1 * objectA.angularVelocity * penetrationPointToCentroidA.y,
      y: objectA.angularVelocity * penetrationPointToCentroidA.x,
    });
    let angularVelocityB = new Vector({
      x: -1 * objectB.angularVelocity * penetrationPointToCentroidB.y,
      y: objectB.angularVelocity * penetrationPointToCentroidB.x,
    });

    let relativeVelocityA = addVector(objectA.velocity, angularVelocityA);

    let relativeVelocityB = addVector(objectB.velocity, angularVelocityB);

    let relativeVelocity = subVector(relativeVelocityB, relativeVelocityA);
    let velocityDotCollision = relativeVelocity.getDotProduct(this.normal);
    if (velocityDotCollision > 0) {
      return;
    }

    let massInverseSum = objectA.massInverse + objectB.massInverse;
    // 반발력 연산
    let collisionRestitution =
      (2 * objectA.matter.restitution * objectB.matter.restitution) /
      (objectA.matter.restitution + objectB.matter.restitution);

    if (!minRestitution) {
      collisionRestitution = Math.min(objectA.matter.restitution, objectB.matter.restitution);
    }

    let crossRestitutionVectorA = penetrationPointToCentroidA.cross(this.normal);
    let crossRestitutionVectorB = penetrationPointToCentroidB.cross(this.normal);

    let crossSum =
      crossRestitutionVectorA * crossRestitutionVectorA * objectA.inertiaInverse +
      crossRestitutionVectorB * crossRestitutionVectorB * objectB.inertiaInverse;

    let j = -(1 + collisionRestitution) * velocityDotCollision;
    j /= massInverseSum + crossSum;

    let impulseCollision = scaleVector(this.normal, j);
    let impulseVectorA = scaleVector(impulseCollision, -1 * objectA.massInverse);
    let impulseVectorB = scaleVector(impulseCollision, objectB.massInverse);

    objectA.velocity = addVector(objectA.velocity, impulseVectorA);
    objectB.velocity = addVector(objectB.velocity, impulseVectorB);

    objectA.angularVelocity += -crossRestitutionVectorA * j * objectA.inertiaInverse;
    objectB.angularVelocity += crossRestitutionVectorB * j * objectB.inertiaInverse;

    // 마찰력 연산

    let velocityNormalDirection = scaleVector(
      this.normal,
      relativeVelocity.getDotProduct(this.normal),
    );
    let tangent = subVector(relativeVelocity, velocityNormalDirection);
    tangent = scaleVector(tangent, -1);

    let collisionFriction =
      (2 * objectA.matter.friction * objectB.matter.friction) /
      (objectA.matter.friction + objectB.matter.friction);

    if (!minFriction) {
      collisionFriction = Math.min(objectA.matter.friction, objectB.matter.friction);
    }

    if (Math.abs(tangent.x) > 0.00001 || Math.abs(tangent.y) > 0.00001) {
      tangent.normalize();
      // this.drawUtils.drawArrow(
      //   addVector(objectA.shape.centroid, scaleVector(tangent, 40)),
      //   objectA.shape.centroid,
      //   "blue"
      // );
    }

    let crossFrictionVectorA = penetrationPointToCentroidA.cross(tangent);
    let crossFrictionVectorB = penetrationPointToCentroidB.cross(tangent);

    let crossTangentSum =
      crossFrictionVectorA * crossFrictionVectorA * objectA.inertiaInverse +
      crossFrictionVectorB * crossFrictionVectorB * objectB.inertiaInverse;

    let velocityDotFriction = relativeVelocity.getDotProduct(tangent);

    let frictionalImpulse = -(1 + collisionFriction) * velocityDotFriction * minFriction;
    frictionalImpulse /= massInverseSum + crossTangentSum;

    if (frictionalImpulse > j) {
      frictionalImpulse = j;
    }

    let frictionalImpulseVector = scaleVector(tangent, frictionalImpulse);

    objectA.velocity = subVector(
      objectA.velocity,
      scaleVector(frictionalImpulseVector, objectA.massInverse),
    );
    objectB.velocity = addVector(
      objectB.velocity,
      scaleVector(frictionalImpulseVector, objectB.massInverse),
    );

    objectA.angularVelocity += -crossFrictionVectorA * frictionalImpulse * objectA.inertiaInverse;
    objectB.angularVelocity += crossFrictionVectorB * frictionalImpulse * objectB.inertiaInverse;
  }

  positionalCorrection(objectA: RigidBody, objectB: RigidBody, correctDelta: number) {
    let correction = (this.depth / (objectA.massInverse + objectB.massInverse)) * correctDelta;

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
      scaleVector(this.normal, this.depth * -1),
    );
    this.drawUtils.drawArrow(headPosition, this.penetrationPoint, 'blue');

    this.drawUtils.drawPoint(this.penetrationPoint, 3, 'gray');
  }
}
