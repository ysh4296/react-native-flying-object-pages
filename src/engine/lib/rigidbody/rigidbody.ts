import Shape from './shape';
import Calculator from '@engine/utils/calculator';
import Matter from '../matter';
import Vector, { addVector, scaleVector, subVector } from '../vector';

export default class RigidBody {
  id: number;
  shape: Shape;
  mass: number;
  massInverse: number;
  force: Vector;
  torque: number;
  velocity: Vector;
  angularVelocity: number;
  isKinematic: boolean;
  matter: Matter;
  inertia: number;
  inertiaInverse: number;
  nonCollisionObjects: Set<RigidBody>;
  private static instance: RigidBody;

  constructor(shape: Shape, mass: number = 0) {
    this.shape = shape;
    /**
     * @todo
     * don't create object id at rigidbody it makes useless object id
     */
    this.id = Calculator.getInstance().generateObjectId();
    this.shape.calculateBoundingBox();
    this.mass = mass;
    if (this.mass > 0) {
      this.massInverse = 1.0 / mass;
      this.isKinematic = false;
    } else {
      this.mass = 0;
      this.massInverse = 0;
      this.isKinematic = true;
    }
    this.force = new Vector({ x: 0, y: 0 });
    this.torque = 0;
    this.velocity = new Vector({ x: 0, y: 0 });
    this.angularVelocity = 0;
    this.matter = new Matter();
    this.inertia = this.shape.calculateInertia(this.mass);
    this.nonCollisionObjects = new Set();

    if (this.inertia > 0.0001) {
      this.inertiaInverse = 1.0 / this.inertia;
    } else {
      this.inertiaInverse = 0;
    }
  }

  addNonCollisionObject(object: RigidBody) {
    this.nonCollisionObjects.add(object);
    object.nonCollisionObjects.add(this);
  }

  deleteNonCollisionObject(object: RigidBody) {
    if (this.nonCollisionObjects.has(object)) {
      this.nonCollisionObjects.delete(object);
    }
    if (object.nonCollisionObjects.has(object)) {
      object.nonCollisionObjects.delete(object);
    }
  }

  canCollision(object: RigidBody): boolean {
    return !this.nonCollisionObjects.has(object);
  }

  getShape() {
    return this.shape;
  }

  getAngularVelocity() {
    return this.angularVelocity;
  }

  addForce(forceVector: Vector) {
    this.force.add(forceVector);
  }

  addForceAtPoint(point: Vector, forceVector: Vector) {
    let direction = subVector(point, this.shape.centroid);
    this.force.add(forceVector);
    this.torque += direction.cross(forceVector);
  }

  addVelocity(velocityVector: Vector) {
    this.velocity.add(velocityVector);
  }

  setVelocity(velocity: Vector) {
    this.velocity = velocity.getCopy();
  }

  update(deltaTime: number) {
    if (deltaTime === 0) return;
    this.integrate(deltaTime);
    this.velocity.scale(0.99999);
    this.angularVelocity *= 0.999;
    this.force = new Vector({ x: 0, y: 0 });
    this.torque = 0;
  }

  integrate(deltaTime: number) {
    this.midPoint(deltaTime);
  }

  semiImplicitEuler(deltaTime: number) {
    let accelation = scaleVector(this.force, this.massInverse);
    this.velocity = addVector(this.velocity, scaleVector(accelation, deltaTime));
    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);

    let rotationalAcceleration = this.torque * this.inertiaInverse;
    this.angularVelocity += rotationalAcceleration * deltaTime;

    let deltaRotation = this.angularVelocity * deltaTime;
    this.shape.rotate(deltaRotation);
  }

  forwardEuler(deltaTime: number) {
    let accelation = scaleVector(this.force, this.massInverse);
    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);
    this.velocity = addVector(this.velocity, scaleVector(accelation, deltaTime));

    let rotationalAcceleration = this.torque * this.inertiaInverse;
    this.angularVelocity += rotationalAcceleration * deltaTime;

    let deltaRotation = this.angularVelocity * deltaTime;
    this.shape.rotate(deltaRotation);
  }

  midPoint(deltaTime: number) {
    let accelation = scaleVector(this.force, this.massInverse);
    accelation.scale(0.5);
    this.velocity = addVector(this.velocity, scaleVector(accelation, deltaTime));
    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);

    let rotationalAcceleration = this.torque * this.inertiaInverse;
    this.angularVelocity += rotationalAcceleration * deltaTime;

    let deltaRotation = this.angularVelocity * deltaTime;
    this.shape.rotate(deltaRotation / 2);
  }

  rungeKutta4(deltaTime: number) {
    let p1, p2, p3, p4;
    let computeAccelation = (force: Vector) => scaleVector(force, this.massInverse);

    // p1 계산
    let accelation = computeAccelation(this.force);
    p1 = scaleVector(accelation, deltaTime);

    // p2 계산
    let tempForce = addVector(this.force, scaleVector(p1, 0.5));
    accelation = computeAccelation(tempForce);
    p2 = scaleVector(accelation, deltaTime);

    // p3 계산
    tempForce = addVector(this.force, scaleVector(p2, 0.5));
    accelation = computeAccelation(tempForce);
    p3 = scaleVector(accelation, deltaTime);

    // p4 계산
    tempForce = addVector(this.force, scaleVector(p3, 0.5));
    accelation = computeAccelation(tempForce);
    p4 = scaleVector(accelation, deltaTime);

    let deltaVelocity = p1;
    deltaVelocity.add(p4);
    deltaVelocity.add(scaleVector(p2, 2));
    deltaVelocity.add(scaleVector(p3, 2));
    deltaVelocity.scale(1 / 6.0);

    this.velocity = addVector(this.velocity, deltaVelocity);

    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);

    let rotationalAcceleration = this.torque * this.inertiaInverse;
    this.angularVelocity += rotationalAcceleration * deltaTime;

    let deltaRotation = this.angularVelocity * deltaTime;
    this.shape.rotate(deltaRotation);
  }

  log() {
    console.log('force: x = ' + this.force.x + ' y = ' + this.force.y);
    console.log('velocity: x = ' + this.velocity.x + ' y = ' + this.velocity.y);
  }

  drawEffect() {}

  active() {}
}
