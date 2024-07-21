import { registry } from '@engine/lib/main';
import Matter from '@engine/lib/matter';
import Vector, { addVector, scaleVector } from '@engine/lib/vector';
import Rectangle from '../../rectangle';
import RigidBody from '../../rigidbody';

export default class Escalator extends RigidBody {
  counter: number;
  direction: Vector;
  escalatorConstant: number;
  constructor(
    position: Vector,
    width: number,
    height: number,
    color: string,
    direction: Vector = new Vector({ x: 1, y: 0 }),
    escalatorConstant = 10,
  ) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.counter = 0;
    this.matter = new Matter(0, 1);
    this.direction = direction;
    this.escalatorConstant = escalatorConstant;
    this.shape.draw = () => {
      const accelationDirection = this.shape.calculatorUtils.rotateAroundPoint(
        this.direction,
        new Vector({ x: 0, y: 0 }),
        this.shape.orientation,
      );

      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: width, y: height }),
        'gray',
        this.shape.orientation,
      );
      this.shape.drawUtils.drawArrow(
        addVector(
          scaleVector(accelationDirection, 1 / accelationDirection.length()),
          this.shape.centroid,
        ),
        this.shape.centroid,
        'white',
      );

      // escalator animation
      for (let i = 1; i < this.shape.vertices.length; i++) {
        registry.engine.drawUtils.drawDottedLine(
          this.shape.vertices[i - 1],
          this.shape.vertices[i],
          'black',
          -registry.animationOffset * this.direction.x * 0.1,
        );
      }
      registry.engine.drawUtils.drawDottedLine(
        this.shape.vertices[this.shape.vertices.length - 1],
        this.shape.vertices[0],
        'black',
        -registry.animationOffset * this.direction.x * 0.1,
      );
    };
  }

  active() {}
}
