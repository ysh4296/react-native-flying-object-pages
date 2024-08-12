import Circle from '@engine/lib/rigidbody/circle';
import RigidBody from '@rigidbody/rigidbody';
import Vector, { rotateVector, subVector } from '@engine/lib/vector';
import { registry } from '@engine/lib/main';

export default class ImageCircle extends RigidBody {
  src: string;
  constructor(position: Vector, src: string) {
    super(
      new Circle(new Vector({ x: position.x + Math.random() * 10 - 5, y: position.y }), 25, 'blue'),
      0.04,
    );

    this.src = src;

    const originalUpdate = this.update.bind(this);

    this.update = (deltaTime: number) => {
      if (
        this.shape.collisionTime + registry.engine.collisionCache.cooldown * 2 >
        registry.gameTime
      ) {
        originalUpdate(0);
        return;
      }
      originalUpdate(deltaTime);
    };

    this.shape.draw = () => {
      if (this.shape.collisionTime + registry.engine.collisionCache.cooldown > registry.gameTime) {
        registry.engine.drawUtils.drawCircle(this.shape.centroid, 25, 'white');
        return;
      }
      this.shape.drawUtils.drawCircle(this.shape.centroid, 25, '#87CEFA');
      this.shape.drawUtils.ctx.save();
      const newStart = subVector(
        this.shape.centroid,
        rotateVector(new Vector({ x: 25, y: 25 }), this.shape.orientation),
      );
      this.shape.drawUtils.ctx.translate(newStart.x, newStart.y);
      this.shape.drawUtils.ctx.rotate(this.shape.orientation);

      registry.sprite.drawSprite();
      this.shape.drawUtils.ctx.restore();
    };
  }
}
