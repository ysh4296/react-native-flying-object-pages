import Polygon from './polygon';
import Vector from '../vector';
import { registry } from '../main';

export default class Rectangle extends Polygon {
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
    super.setCentroid(position);
    this.width = width;
    this.height = height;
  }

  calculateInertia(mass: number) {
    return (mass * (this.width * this.width + this.height * this.height)) / 12;
  }

  draw() {
    super.draw();
    registry.engine.drawUtils.fillRect(
      this.centroid,
      new Vector({ x: this.width, y: this.height }),
      this.color,
      this.orientation,
    );
  }
}
