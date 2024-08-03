import { registry } from '../main';
import Rectangle from '@rigidbody/rectangle';
import Vector, { scaleVector, subVector } from '../vector';
import Effect from './effect';
import RigidBody from '../rigidbody/rigidbody';

export default class Blower extends Effect {
  destination: Vector;
  length: number;
  constructor(position: Vector, destination: Vector) {
    super(
      new Rectangle(
        position,
        registry.engine.GameBoard.cellSize * 2,
        registry.engine.GameBoard.cellSize,
        'rgba(238, 130, 238 , 0.6)',
      ),
      0,
    );
    this.destination = destination;
    this.length = registry.engine.GameBoard.cellSize * 3;
    const originalRotate = this.shape.rotate.bind(this.shape);
    this.shape.rotate = (radian: number, spindle?: Vector) => {
      originalRotate(radian, spindle);
      this.destination.rotate(radian, spindle);
    };
  }

  drawEffect() {
    this.shape.draw();
    registry.engine.drawUtils.drawCircle(this.destination, 5, 'red');
  }

  applyEffect(object: RigidBody) {
    const force = subVector(this.destination, object.shape.centroid);
    const restLength = force.length();
    force.normalize();
    object.addForceAtPoint(
      object.shape.centroid,
      scaleVector(force, 5 * (this.length - restLength)),
    );
  }
}
