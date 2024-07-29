import { registry } from '../main';
import Rectangle from '../rectangle';
import RigidBody from '../rigidbody';
import Vector, { scaleVector, subVector } from '../vector';
import Effect from './effect';

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
