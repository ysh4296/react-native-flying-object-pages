import Grill from '../block/mover/grill';
import Heat from '../effect/heat';
import { registry } from '../main';
import Vector, { addVector } from '../vector';
import Component from './component';

export default class Heater extends Component {
  constructor(position: Vector) {
    super(position);
  }

  addComponent() {
    const heater = new Grill(
      new Vector(this.centroid),
      registry.engine.GameBoard.cellSize,
      registry.engine.GameBoard.cellSize,
      'red',
    );

    const heat = new Heat(
      addVector(heater.shape.centroid, new Vector({ x: 0, y: registry.engine.GameBoard.cellSize })),
    );

    this.objects.push(heater);
    this.effects.push(heat);
    registry.engine.components.push(this);
  }
}
