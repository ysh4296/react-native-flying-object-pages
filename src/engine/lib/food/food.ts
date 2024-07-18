import RigidBody from '../rigidbody';
import Shape from '../shape';

export default class Food extends RigidBody {
  temprature: number;
  maxTemprature: number;
  counter: number;
  maxCounter: number;
  constructor(shape: Shape, mass: number) {
    super(shape, mass);
    this.temprature = 0;
    this.maxTemprature = 0;
    this.counter = 0;
    this.maxCounter = 0;
  }

  /** Food's unique interaction */
  active() {}
}
