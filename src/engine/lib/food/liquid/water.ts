import Circle from '@engine/lib/rigidbody/circle';
// import { registry } from '@engine/lib/main';
import Matter from '@engine/lib/matter';
import RigidBody from '@rigidbody/rigidbody';
import Vector, { rotateVector, subVector } from '@engine/lib/vector';
import { registry } from '@engine/lib/main';
// import { registry } from '@engine/lib/main';
// import Component from '@engine/lib/component/component';

export default class Water extends RigidBody {
  temprature: number;
  hp: number;
  constructor(position: Vector) {
    super(
      new Circle(new Vector({ x: position.x + Math.random() * 10 - 5, y: position.y }), 25, 'blue'),
      0.04,
    );
    this.temprature = 0;
    this.shape.draw = () => {
      registry.engine.drawUtils.drawCircle(this.shape.centroid, 25, '#87CEFA');
      registry.engine.drawUtils.ctx.save();
      const newStart = subVector(
        this.shape.centroid,
        rotateVector(new Vector({ x: 25, y: 25 }), this.shape.orientation),
      );
      registry.engine.drawUtils.ctx.translate(newStart.x, newStart.y);
      registry.engine.drawUtils.ctx.rotate(this.shape.orientation);

      registry.sprite.drawSprite();
      registry.engine.drawUtils.ctx.restore();
    };
    this.matter = new Matter(0.7, 0.4);
    this.hp = 300;
  }

  active() {
    this.hp -= 1;
  }
}
