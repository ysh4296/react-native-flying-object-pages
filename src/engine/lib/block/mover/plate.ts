import Matter from '@engine/lib/matter';
import Vector from '@engine/lib/vector';
import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';

export default class Plate extends RigidBody {
  constructor(position: Vector, width: number, height: number, color: string = 'black') {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0.05);
    this.matter = new Matter(0, 0.7);

    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: width, y: height }),
        'black',
        this.shape.orientation,
      );
    };
  }

  active() {}
}
