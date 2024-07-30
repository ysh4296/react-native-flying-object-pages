import { registry } from '@engine/lib/main';
import Matter from '@engine/lib/matter';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Vector, { rotateVector, subVector } from '@engine/lib/vector';

export default class Floater extends RigidBody {
  counter: number;
  maxCounter: number;
  length: number;
  originPosition: Vector;
  rotation: number;
  delay: number;
  minDelay: number;
  maxDelay: number;
  constructor(
    position: Vector,
    width: number,
    height: number,
    color: string,
    rotation: number,
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
    this.rotation = rotation;
    this.shape.rotate(rotation);
    this.delay = 0;
    this.minDelay = minDelay;
    this.maxDelay = maxDelay;
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
    if (
      subVector(this.originPosition, this.shape.centroid).length() < this.length ||
      subVector(this.originPosition, this.shape.centroid).length() >= 0
    ) {
      this.velocity = rotateVector(
        new Vector({ x: 0, y: moveY * (this.length / mid) * 60 }),
        this.rotation,
      );
    } else {
      this.velocity = new Vector({ x: 0, y: 0 });
    }
    this.counter++;
  }
}
