import Matter from '@engine/lib/matter';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Vector from '@engine/lib/vector';

export default class Bacon extends RigidBody {
  temprature: number;
  constructor(position: Vector) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), 30, 20, 'blue'), 0.04);
    this.temprature = 0;
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 30, y: 20 }),
        '#d69286',
        this.getShape().orientation,
      );
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 30, y: 5 }),
        '#b04d4d',
        this.getShape().orientation,
        new Vector({ x: 0, y: -5 }),
      );
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 30, y: 10 }),
        '#F2C6BA',
        this.getShape().orientation,
        new Vector({ x: 0, y: 5 }),
      );
    };
    this.matter = new Matter(0.8, 0.5);
  }
}
