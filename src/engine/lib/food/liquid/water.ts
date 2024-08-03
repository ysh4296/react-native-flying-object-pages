import Circle from '@engine/lib/rigidbody/circle';
// import { registry } from '@engine/lib/main';
import Matter from '@engine/lib/matter';
import RigidBody from '@rigidbody/rigidbody';
import Vector from '@engine/lib/vector';

export default class Water extends RigidBody {
  temprature: number;
  constructor(position: Vector) {
    super(
      new Circle(new Vector({ x: position.x + Math.random() * 10 - 5, y: position.y }), 10, 'blue'),
      0.04,
    );
    this.temprature = 0;
    this.shape.draw = () => {
      this.shape.drawUtils.drawCircle(this.shape.centroid, 15, '#87CEFA');
    };
    this.matter = new Matter(0, 0);
  }
}
