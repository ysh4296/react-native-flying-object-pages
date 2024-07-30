import Floater from '../block/mover/floater';
import { registry } from '../main';
import Rectangle from '../rectangle';
import RigidBody from '../rigidbody';
import Vector from '../vector';
import Component from './component';

export default class Pressure extends Component {
  block: RigidBody;
  floater: RigidBody;
  rotation: number;

  constructor(position: Vector, rotation: number = 0) {
    super();
    this.rotation = rotation;
    this.block = new RigidBody(
      new Rectangle(
        new Vector(position),
        registry.engine.GameBoard.cellSize,
        registry.engine.GameBoard.cellSize,
        'black',
      ),
      0,
    );
    this.block.shape.rotate(rotation);
    this.floater = new Floater(
      new Vector(position),
      registry.engine.GameBoard.cellSize,
      registry.engine.GameBoard.cellSize,
      'gray',
      this.rotation,
      0,
      120,
      registry.engine.GameBoard.cellSize * 4,
    );
  }

  addComponent() {
    registry.engine.rigidBodies.push(this.floater);
    registry.engine.rigidBodies.push(this.block);
  }
}
