import Food from '../food/food';
import { registry } from '../main';
import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';
import Vector from '../vector';
import Effect from './effect';

export default class Heat extends Effect {
  length: number;
  constructor(position: Vector) {
    super(
      new Rectangle(
        position,
        registry.engine.GameBoard.cellSize,
        registry.engine.GameBoard.cellSize,
        'rgba(255, 99, 71, 0.6)',
      ),
      0,
    );
    this.length = registry.engine.GameBoard.cellSize * 3;
  }

  drawEffect() {
    this.shape.draw();
  }

  applyEffect(object: RigidBody) {
    if (object instanceof Food) {
      if (object.maxTemprature >= object.temprature) {
        object.temprature += 1;
      }
    }
  }
}
