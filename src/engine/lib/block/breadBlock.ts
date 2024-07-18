import Bread from '../food/solid/bread';
import { registry } from '../main';
import Rectangle from '../rectangle';
import RigidBody from '../rigidbody';
import Vector, { subVector } from '../vector';

export default class BreadBlock extends RigidBody {
  counter: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.counter = 0;
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        new Vector({ x: position.x, y: position.y }),
        new Vector({ x: width, y: height }),
        color,
        this.getShape().orientation,
      );
    };
  }

  active() {
    if (this.counter < 1) {
      this.counter++;
      registry.engine.rigidBodies.push(
        new Bread(subVector(this.shape.centroid, new Vector({ x: 0, y: 0 }))),
      );
    }
  }
}
