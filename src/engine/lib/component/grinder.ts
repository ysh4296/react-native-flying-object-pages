import Draw from '@engine/utils/draw';
import Wheel from '../block/mover/wheel';
import { registry } from '../main';
import Polygon from '../rigidbody/polygon';
import RigidBody from '@rigidbody/rigidbody';
import Vector, { addVector, rotateVector } from '../vector';
import Component from './component';

export default class Grinder extends Component {
  constructor(position: Vector) {
    super(position);
  }

  addComponent() {
    const bladeCount = 6;

    for (let i = 0; i < bladeCount; i++) {
      const blade = new RigidBody(
        new Polygon(
          [
            addVector(this.centroid, new Vector({ x: 30, y: 10 })),
            addVector(this.centroid, new Vector({ x: 0, y: 50 })),
            addVector(this.centroid, new Vector({ x: 0, y: 10 })),
          ],
          'rgb(230, 230, 230)',
        ),
        0,
      );
      blade.shape.centroid = this.centroid;
      blade.active = () => {
        blade.angularVelocity = -15;
      };
      blade.shape.draw = () => {
        Draw.getInstance().fillPolygon(blade.shape.vertices, blade.shape.color);
        Draw.getInstance().strokePolygon(blade.shape.vertices, 'black');
      };
      blade.shape.rotate(((Math.PI * 2) / bladeCount) * i);
      this.objects.push(blade);
    }

    const wheel = new Wheel(
      this.centroid,
      registry.engine.GameBoard.cellSize / 4,
      'rgb(180, 180, 180)',
    );
    wheel.shape.draw = () => {
      Draw.getInstance().drawCircle(
        this.centroid,
        registry.engine.GameBoard.cellSize / 3,
        wheel.shape.color,
      );
      Draw.getInstance().strokeCircle(
        this.centroid,
        registry.engine.GameBoard.cellSize / 4,
        'rgb(120, 120, 120)',
      );
      const boxNum = 4;
      for (let i = 0; i < boxNum; i++) {
        Draw.getInstance().fillRect(
          addVector(
            this.centroid,
            rotateVector(
              new Vector({
                x: 0,
                y: registry.engine.GameBoard.cellSize / 4 - registry.engine.GameBoard.cellSize / 16,
              }),
              (Math.PI / 2) * i + wheel.shape.orientation,
            ),
          ),
          new Vector({
            x: registry.engine.GameBoard.cellSize / 8,
            y: registry.engine.GameBoard.cellSize / 8,
          }),
          'rgb(120, 120, 120)',
          wheel.shape.orientation,
        );
      }
      Draw.getInstance().fillCircle(
        this.centroid,
        registry.engine.GameBoard.cellSize / 16,
        'rgb(230, 230, 230)',
      );
    };
    this.objects.push(wheel);
    registry.engine.components.push(this);
  }
}
