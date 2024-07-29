import Blower from '../effect/blower';
import { registry } from '../main';
import Rectangle from '../rectangle';
import RigidBody from '../rigidbody';
import Vector, { addVector } from '../vector';
import Component from './component';

export default class Fan extends Component {
  center: Vector;
  rotation: number;
  constructor(position: Vector, rotation: number = 0) {
    super();
    this.center = position;
    this.rotation = rotation;
  }

  addComponent() {
    const lboard = new RigidBody(
      new Rectangle(
        addVector(
          new Vector(this.center),
          new Vector({ x: 0, y: registry.engine.GameBoard.cellSize / 2 }),
        ),
        registry.engine.GameBoard.cellSize,
        10,
        'gray',
      ),
      0,
    );
    lboard.shape.rotate(this.rotation, this.center);
    registry.engine.rigidBodies.push(lboard);

    const rboard = new RigidBody(
      new Rectangle(
        addVector(
          new Vector(this.center),
          new Vector({ x: 0, y: -registry.engine.GameBoard.cellSize / 2 }),
        ),
        registry.engine.GameBoard.cellSize,
        10,
        'gray',
      ),
      0,
    );
    rboard.shape.rotate(this.rotation, this.center);
    registry.engine.rigidBodies.push(rboard);

    const effect = new Blower(
      addVector(
        new Vector(this.center),
        new Vector({ x: -registry.engine.GameBoard.cellSize / 2, y: 0 }),
      ),
      addVector(
        new Vector(this.center),
        new Vector({ x: registry.engine.GameBoard.cellSize, y: 0 }),
      ),
    );
    effect.shape.rotate(this.rotation, this.center);
    effect.destination.rotate(this.rotation, this.center);

    registry.engine.effects.push(effect);
  }
}
