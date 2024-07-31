import { registry } from '@engine/lib/main';
import Matter from '@engine/lib/matter';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Vector, { rotateVector, scaleVector, subVector } from '@engine/lib/vector';

export default class Floater extends RigidBody {
  counter: number;
  maxCounter: number;
  length: number;
  originPosition: Vector;
  delay: number;
  direction: Vector;
  minDelay: number;
  maxDelay: number;
  constructor(
    position: Vector,
    width: number,
    height: number,
    color: string,
    minDelay: number,
    maxDelay: number,
    length: number,
  ) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.matter = new Matter(0, 0.05);
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: width, y: height }),
        color,
        this.shape.orientation,
      );
    };
    this.counter = 0;
    this.length = length;
    this.maxCounter = (this.length * 2 * 3 * 60) / registry.engine.GameBoard.cellSize;
    this.originPosition = new Vector(position);
    this.delay = 0;
    this.minDelay = minDelay;
    this.maxDelay = maxDelay;
    this.direction = new Vector({ x: 0, y: 1 });
  }

  active() {
    const mid = this.maxCounter / 2;
    this.counter = this.counter % this.maxCounter;
    if (this.counter === 0) {
      this.velocity = new Vector({ x: 0, y: 0 });
      if (this.delay < this.minDelay) this.delay++;
      else {
        this.delay = 0;
        this.counter++;
      }
      return;
    }
    if (this.counter === mid) {
      this.velocity = new Vector({ x: 0, y: 0 });
      if (this.delay < this.maxDelay) this.delay++;
      else {
        this.delay = 0;
        this.counter++;
      }
      return;
    }
    let moveY = 1;
    if (mid > this.counter) {
      moveY = -1;
    }
    moveY *= (this.length / mid) * 60;

    // console.log('length : ', this.length);
    // console.log(subVector(this.originPosition, this.shape.centroid).length(), moveY / 60);
    if (
      subVector(this.originPosition, this.shape.centroid).length() - moveY / 60 <= this.length &&
      subVector(this.originPosition, this.shape.centroid).length() - moveY / 60 >= 0
    ) {
      this.velocity = scaleVector(rotateVector(this.direction, this.shape.orientation), moveY);
    } else {
      this.velocity = new Vector({ x: 0, y: 0 });
    }
    this.counter++;
  }
}
