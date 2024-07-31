import Circle from '@engine/lib/circle';
import Matter from '@engine/lib/matter';
import Vector from '@engine/lib/vector';
import RigidBody from '../../rigidbody';

export default class Wheel extends RigidBody {
  counter: number;
  direction: Vector;
  escalatorConstant: number;
  //   escalatorNumber: number;
  constructor(
    position: Vector,
    radius: number,
    color: string,
    direction: Vector = new Vector({ x: 1, y: 0 }),
    escalatorConstant = 1,
  ) {
    super(new Circle(new Vector({ x: position.x, y: position.y }), radius, color), 0);
    this.counter = 0;
    this.matter = new Matter(0, 0.6);
    this.direction = direction;
    this.escalatorConstant = escalatorConstant;
  }

  active() {
    this.angularVelocity = 1;
  }
}
