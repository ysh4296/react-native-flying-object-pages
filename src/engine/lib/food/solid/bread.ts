import Matter from '@engine/lib/matter';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Vector from '@engine/lib/vector';

export default class Bread extends RigidBody {
  temprature: number;
  constructor(position: Vector) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), 120, 20, 'blue'), 0.1);
    this.temprature = 0;
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 120, y: 20 }),
        '#eec07b',
        this.getShape().orientation,
      );

      let linearGradient: CanvasGradient = this.shape.drawUtils.ctx.createLinearGradient(
        0,
        0,
        5,
        0,
      );
      linearGradient.addColorStop(0, '#6D3200');
      linearGradient.addColorStop(0.5, '#eec07b');
      linearGradient.addColorStop(1, '#eec07b');
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 5, y: 20 }),
        linearGradient,
        this.getShape().orientation,
        new Vector({ x: -57.5, y: 0 }),
      );

      linearGradient = this.shape.drawUtils.ctx.createLinearGradient(-5, 0, 0, 0);

      linearGradient.addColorStop(0, '#eec07b');
      linearGradient.addColorStop(0.5, '#eec07b');
      linearGradient.addColorStop(1, '#6D3200');
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 5, y: 20 }),
        linearGradient,
        this.getShape().orientation,
        new Vector({ x: 57.5, y: 0 }),
      );
      linearGradient = this.shape.drawUtils.ctx.createLinearGradient(0, 0, 20, 0);

      linearGradient.addColorStop(0, '#eec07b');
      linearGradient.addColorStop(0.1, '#f0d1a0');

      linearGradient.addColorStop(0.6, '#f0d1a0');
      linearGradient.addColorStop(1, '#eec07b');
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 5, y: 20 }),
        linearGradient,
        this.getShape().orientation,
        new Vector({ x: 20, y: 0 }),
      );
      linearGradient = this.shape.drawUtils.ctx.createLinearGradient(-20, 0, 0, 0);

      linearGradient.addColorStop(0, '#eec07b');
      linearGradient.addColorStop(0.6, '#f0d1a0');

      linearGradient.addColorStop(0.9, '#f0d1a0');
      linearGradient.addColorStop(1, '#eec07b');
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 5, y: 20 }),
        linearGradient,
        this.getShape().orientation,
        new Vector({ x: -20, y: 0 }),
      );
    };
    this.matter = new Matter(0.2, 0.8);
  }
}
