import Vector, { subVector } from '@engine/lib/vector';
import CollisionManifold from '@engine/utils/collisionManifold';
import Joint from './joint';
import JointConnection from './jointConnection';

export default class HingeJoint extends Joint {
  initialLength: number;
  objectARestitution: number;
  objectBRestitution: number;
  objectAFriction: number;
  objectBFriction: number;
  jointIteration: number;
  jointCorrection: number;

  constructor(connection: JointConnection, jointIteration = 20, jointCorrection = 0.3) {
    super(connection);
    this.initialLength = subVector(
      this.getAnchorAPos() as Vector,
      this.getAnchorBPos() as Vector,
    ).length();

    this.objectARestitution = this.objectA.matter.restitution;
    this.objectBRestitution = this.objectB.matter.restitution;
    this.objectAFriction = this.objectA.matter.friction;
    this.objectBFriction = this.objectB.matter.friction;
    this.jointIteration = jointIteration;
    this.jointCorrection = jointCorrection;
  }

  updateConnectionA() {
    this.clearMaterial();

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

      contact.positionalCorrection(this.objectB, this.objectA, this.jointCorrection);
      contact.resolveCollision(this.objectB, this.objectA);
    }
    this.restoreMatrial();
  }

  updateConnectionB() {
    this.clearMaterial();

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

      contact.positionalCorrection(this.objectA, this.objectB, this.jointCorrection);
      contact.resolveCollision(this.objectA, this.objectB);
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
