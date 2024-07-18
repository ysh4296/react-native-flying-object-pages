import Matter from '@engine/lib/matter';
import Vector, { addVector, scaleVector } from '@engine/lib/vector';
import Rectangle from '../../rectangle';
import RigidBody from '../../rigidbody';

export default class Escalator extends RigidBody {
  counter: number;
  direction: Vector;
  constructor(
    position: Vector,
    width: number,
    height: number,
    color: string,
    direction: Vector = new Vector({ x: 1, y: 0 }),
  ) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.counter = 0;
    this.matter = new Matter(0, 0);
    this.direction = direction;
    const accelationDirection = this.shape.calculatorUtils.rotateAroundPoint(
      this.direction,
      new Vector({ x: 0, y: 0 }),
      this.shape.orientation,
    );
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: width, y: height }),
        'gray',
      );
      this.shape.drawUtils.drawArrow(
        addVector(
          scaleVector(accelationDirection, 1 / accelationDirection.length()),
          this.shape.centroid,
        ),
        this.shape.centroid,
        'white',
      );
    };
  }

  active() {}
}
