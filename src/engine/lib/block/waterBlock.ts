import Rectangle from '../rectangle';
import RigidBody from '../rigidbody';
import Vector from '../vector';

export default class WaterBlock extends RigidBody {
  counter: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(new Rectangle(position, width, height, 'blue'), 0);
    this.counter = 0;
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        position,
        new Vector({ x: width, y: height }),
        color,
        this.shape.orientation,
      );
    };
  }

  active() {
    if (this.counter < 5) {
      this.counter += 1;
      return;
    }
    // registry.engine.rigidBodies.push(new Water(this.shape.centroid));
    this.counter = 0;
  }
}
