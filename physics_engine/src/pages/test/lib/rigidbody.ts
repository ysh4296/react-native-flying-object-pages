import Shape from "./shape";
import Vector, { addVector, scaleVector } from "./vector";

export default class RigidBody {
  shape: Shape;
  mass: number;
  massInverse: number;
  force: Vector;
  velocity: Vector;
  constructor(shape: Shape, mass: number) {
    this.shape = shape;
    this.mass = mass;
    if (this.mass > 0) {
      this.massInverse = 1.0 / mass;
    } else {
      this.mass = 0;
      // Number.MAX_VALUE 로 설정해야 하지 않을까?
      this.massInverse = Number.MAX_VALUE;
    }
    this.force = new Vector({ x: 0, y: 0 });
    this.velocity = new Vector({ x: 0, y: 0 });
  }

  getShape() {
    return this.shape;
  }

  addForce(forceVector: Vector) {
    this.force.add(forceVector);
  }

  addVelocity(velocityVector: Vector) {
    this.velocity.add(velocityVector);
  }

  setVelocity(velocity: Vector) {
    this.velocity = velocity.getCopy();
  }

  update(deltaTime: number) {
    this.integrate(deltaTime);
    this.force = new Vector({ x: 0, y: 0 });
  }

  integrate(deltaTime: number) {
    this.midPoint(deltaTime);
  }

  semiImplicitEuler(deltaTime: number) {
    let accelation = scaleVector(this.force, this.massInverse);
    this.velocity = addVector(
      this.velocity,
      scaleVector(accelation, deltaTime)
    );
    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);
  }

  forwardEuler(deltaTime: number) {
    let accelation = scaleVector(this.force, this.massInverse);
    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);
    this.velocity = addVector(
      this.velocity,
      scaleVector(accelation, deltaTime)
    );
  }

  midPoint(deltaTime: number) {
    let accelation = scaleVector(this.force, this.massInverse);
    accelation.scale(0.5);
    this.velocity = addVector(
      this.velocity,
      scaleVector(accelation, deltaTime)
    );
    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);
  }

  rungeKutta4(deltaTime: number) {
    let p1, p2, p3, p4;
    let computeAccelation = (force: Vector) =>
      scaleVector(force, this.massInverse);

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
  }

  log() {
    console.log("force: x = " + this.force.x + " y = " + this.force.y);
    console.log("force: x = " + this.velocity.x + " y = " + this.velocity.y);
  }
}
