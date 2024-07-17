import Polygon from './polygon';
import Vector from './vector';

export default class Rectangle extends Polygon {
  position: Vector;
  width: number;
  height: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(
      [
        new Vector({ x: position.x - width / 2, y: position.y - height / 2 }),
        new Vector({ x: position.x + width / 2, y: position.y - height / 2 }),
        new Vector({ x: position.x + width / 2, y: position.y + height / 2 }),
        new Vector({ x: position.x - width / 2, y: position.y + height / 2 }),
      ],
      color,
    );
    this.position = position;
    super.setCentroid(this.position);
    this.width = width;
    this.height = height;
  }

  calculateInertia(mass: number) {
    return (mass * (this.width * this.width + this.height * this.height)) / 12;
  }

  draw() {
    super.draw();
    this.drawUtils.fillRect(
      this.position,
      new Vector({ x: this.width, y: this.height }),
      this.color,
      this.orientation,
    );
  }
}
