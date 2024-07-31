import Floater from '../block/mover/floater';
import { registry } from '../main';
import Rectangle from '../rectangle';
import RigidBody from '../rigidbody';
import Vector from '../vector';
import Component from './component';

export default class Pressure extends Component {
  constructor(position: Vector) {
    super(position);
  }

  addComponent() {
    const block = new RigidBody(
      new Rectangle(
        new Vector(this.centroid),
        registry.engine.GameBoard.cellSize,
        registry.engine.GameBoard.cellSize,
        'black',
      ),
      0,
    );
    const floater = new Floater(
      new Vector(this.centroid),
      registry.engine.GameBoard.cellSize,
      registry.engine.GameBoard.cellSize,
      'gray',
      0,
      120,
      registry.engine.GameBoard.cellSize,
    );
    this.objects.push(block);
    this.objects.push(floater);
    registry.engine.components.push(this);
  }
}
