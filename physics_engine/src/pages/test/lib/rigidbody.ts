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
      this.massInverse = 1 / mass;
    } else {
      this.mass = 0;
      // Number.MAX_VALUE 로 설정해야 하지 않을까?
      this.massInverse = 0;
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
    this.force = new Vector({ x: 0, y: 0 });
  }

  forwardEuler(deltaTime: number) {
    let accelation = scaleVector(this.force, this.massInverse);
    let deltaPosition = scaleVector(this.velocity, deltaTime);
    this.shape.move(deltaPosition);
    this.velocity = addVector(
      this.velocity,
      scaleVector(accelation, deltaTime)
    );
    this.force = new Vector({ x: 0, y: 0 });
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
    this.force = new Vector({ x: 0, y: 0 });
  }

  log() {
    console.log("force: x = " + this.force.x + " y = " + this.force.y);
    console.log("force: x = " + this.velocity.x + " y = " + this.velocity.y);
  }
}
