import Matter from '@engine/lib/matter';
import Vector, { addVector, rotateVector } from '@engine/lib/vector';
import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';

export default class Spring extends RigidBody {
  counter: number;
  direction: Vector;
  springConstant: number;
  constructor(
    position: Vector,
    width: number,
    height: number,
    color: string,
    direction: Vector = new Vector({ x: 0, y: -1 }),
    springConstant: number = 500,
  ) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.counter = 0;
    this.matter = new Matter(0, 0);
    this.direction = direction;
    this.springConstant = springConstant;
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: width, y: height }),
        'purple',
        this.shape.orientation,
      );
      this.shape.drawUtils.drawArrow(
        addVector(this.direction, this.shape.centroid),
        this.shape.centroid,
        'white',
      );
    };
    // 기존 rotate 함수 래핑
    const originalRotate = this.shape.rotate.bind(this.shape);
    this.shape.rotate = (radian: number, spindle?: Vector) => {
      originalRotate(radian, spindle); // 기존 rotate 함수 호출
      this.direction = rotateVector(this.direction, radian); // 추가 동작
    };
  }

  active() {
    this.counter = (this.counter + 1) % 60;
  }
}
