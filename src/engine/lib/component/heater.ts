import Grill from '../block/mover/grill';
import Heat from '../effect/heat';
import { registry } from '../main';
import Vector, { addVector } from '../vector';
import Component from './component';

export default class Heater extends Component {
  heater: Grill;
  constructor(position: Vector) {
    super();
    this.heater = new Grill(
      new Vector(position),
      registry.engine.GameBoard.cellSize,
      registry.engine.GameBoard.cellSize,
      'red',
    );
  }

  addComponent() {
    registry.engine.rigidBodies.push(this.heater);

    const heat = new Heat(
      addVector(
        this.heater.shape.centroid,
        new Vector({ x: 0, y: registry.engine.GameBoard.cellSize }),
      ),
    );
    registry.engine.effects.push(heat);
  }
}
