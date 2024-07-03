import Vector, { subVector } from "@engine/lib/vector";
import CollisionManifold from "@engine/utils/collisionManifold";
import Joint from "./joint";
import JointConnection from "./jointConnection";

export default class FixedJoint extends Joint {
  initialLength: number;
  objectARestitution: number;
  objectBRestitution: number;
  objectAFriction: number;
  objectBFriction: number;
  relationOrientation: number;
  jointIteration: number;

  constructor(connection: JointConnection) {
    super(connection);
    this.initialLength = subVector(
      this.getAnchorAPos() as Vector,
      this.getAnchorBPos() as Vector
    ).length();

    this.objectARestitution = this.objectA.matter.restitution;
    this.objectBRestitution = this.objectB.matter.restitution;
    this.objectAFriction = this.objectA.matter.friction;
    this.objectBFriction = this.objectB.matter.friction;
    this.relationOrientation = 0;
    // @add add joint to moving object
    // this.objectB.getShape().orientation - this.objectA.getShape().orientation;
    this.jointIteration = 20;
  }

  updateConnectionA() {
    this.clearMaterial();
    if (this.objectB.isKinematic) return;

    for (let i = 0; i < this.jointIteration; i++) {
      const anchorAPos = this.getAnchorAPos();
      const anchorBPos = this.getAnchorBPos();

      if (!anchorAPos || !anchorBPos) return;
      const direction = subVector(anchorBPos, anchorAPos);
      const distance = direction.length();
      if (distance < 0.0000001) {
        break;
      }
      direction.normalize();
      let normalDirection = direction.getCopy();
      let contact = new CollisionManifold(0, normalDirection, anchorBPos);

      if (distance > this.initialLength) {
        contact.depth = distance - this.initialLength;
      } else {
        contact.depth = this.initialLength - distance;
        contact.normal.scale(-1);
      }

      contact.resolveCollision(this.objectB, this.objectA);
      contact.positionalCorrection(this.objectB, this.objectA, 0.3);

      const currentOrientationDiff =
        this.objectB.getShape().orientation -
        this.objectA.getShape().orientation;
      const fixedOrientation =
        this.relationOrientation - currentOrientationDiff;

      this.objectB.angularVelocity += fixedOrientation;
    }
    this.restoreMatrial();
  }

  updateConnectionB() {
    this.clearMaterial();
    if (this.objectA.isKinematic) return;

    for (let i = 0; i < this.jointIteration; i++) {
      const anchorAPos = this.getAnchorAPos();
      const anchorBPos = this.getAnchorBPos();
      if (!anchorAPos || !anchorBPos) return;
      const direction = subVector(anchorAPos, anchorBPos);
      const distance = direction.length();
      if (distance < 0.0000001) {
        break;
      }
      direction.normalize();
      let normalDirection = direction.getCopy();
      let contact = new CollisionManifold(0, normalDirection, anchorAPos);
      if (distance > this.initialLength) {
        contact.depth = distance - this.initialLength;
      } else {
        contact.depth = this.initialLength - distance;
        contact.normal.scale(-1);
      }

      contact.flipNormalEnabled = false;

      contact.positionalCorrection(this.objectA, this.objectB, 0.3);
      contact.resolveCollision(this.objectA, this.objectB);
      const currentOrientationDiff =
        this.objectA.getShape().orientation -
        this.objectB.getShape().orientation;
      const fixedOrientation =
        this.relationOrientation - currentOrientationDiff;

      this.objectA.angularVelocity += fixedOrientation;
    }
    this.restoreMatrial();
  }

  restoreMatrial() {
    this.objectA.matter.restitution = this.objectARestitution;
    this.objectB.matter.restitution = this.objectBRestitution;
    this.objectA.matter.friction = this.objectAFriction;
    this.objectB.matter.friction = this.objectBFriction;
  }

  clearMaterial() {
    this.objectA.matter.restitution = 0;
    this.objectB.matter.restitution = 0;
    this.objectA.matter.friction = 0;
    this.objectB.matter.friction = 0;
  }
}
