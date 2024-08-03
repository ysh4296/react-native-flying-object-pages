import Blower from '../effect/blower';
import { registry } from '../main';
import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';
import Vector, { addVector } from '../vector';
import Component from './component';

export default class Fan extends Component {
  rotation: number;
  constructor(position: Vector, rotation: number = 0) {
    super(position);
    this.rotation = rotation;
  }

  addComponent() {
    const lboard = new RigidBody(
      new Rectangle(
        addVector(
          new Vector(this.centroid),
          new Vector({ x: 0, y: registry.engine.GameBoard.cellSize / 2 }),
        ),
        registry.engine.GameBoard.cellSize,
        10,
        'gray',
      ),
      0,
    );
    lboard.shape.rotate(this.rotation, this.centroid);

    const rboard = new RigidBody(
      new Rectangle(
        addVector(
          new Vector(this.centroid),
          new Vector({ x: 0, y: -registry.engine.GameBoard.cellSize / 2 }),
        ),
        registry.engine.GameBoard.cellSize,
        10,
        'gray',
      ),
      0,
    );
    rboard.shape.rotate(this.rotation, this.centroid);

    const effect = new Blower(
      addVector(
        new Vector(this.centroid),
        new Vector({ x: -registry.engine.GameBoard.cellSize / 2, y: 0 }),
      ),
      addVector(
        new Vector(this.centroid),
        new Vector({ x: registry.engine.GameBoard.cellSize, y: 0 }),
      ),
    );
    effect.shape.rotate(this.rotation, this.centroid);
    effect.destination.rotate(this.rotation, this.centroid);

    this.objects.push(lboard);
    this.objects.push(rboard);
    this.effects.push(effect);
    registry.engine.components.push(this);
  }
}
