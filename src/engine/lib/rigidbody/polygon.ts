import Shape from './shape';
import Vector, { addVector, scaleVector, subVector } from '../vector';
import { registry } from '../main';

export default class Polygon extends Shape {
  constructor(vertices: Vector[], color: string) {
    super(vertices, color);
    this.normals = this.calculatorUtils.calcNormals(this.vertices);
    let centroid = this.calculatorUtils.calcCentroid(this.vertices);
    super.setCentroid(centroid);
  }

  calculateInertia(mass: number) {
    // triangulation
    let inertia = 0;
    let massPertriangle = mass / this.vertices.length;
    for (let i = 0; i < this.vertices.length; i++) {
      let next = this.calculatorUtils.getIndex(i + 1, this.vertices.length);
      let centerToVertice0 = subVector(this.vertices[i], this.centroid);
      let centerToVertice1 = subVector(this.vertices[next], this.centroid);
      let triangleInertia =
        (massPertriangle *
          (centerToVertice0.lengthSquare() +
            centerToVertice1.lengthSquare() +
            centerToVertice0.getDotProduct(centerToVertice1))) /
        6;
      inertia += triangleInertia;
    }
    return inertia;
  }

  draw() {
    super.draw();
    for (let i = 0; i < this.normals.length; i++) {
      let next = this.calculatorUtils.getIndex(i + 1, this.vertices.length);
      let direction = subVector(this.vertices[next], this.vertices[i]);
      let tail = addVector(this.vertices[i], scaleVector(direction, 1 / 2.0));
      let head = addVector(tail, scaleVector(this.normals[i], 10));
      registry.engine.drawUtils.drawArrow(head, tail, 'blue');
    }
  }

  rotate(radian: number, spindle: Vector = this.centroid) {
    super.rotate(radian, spindle);
    this.normals = this.calculatorUtils.calcNormals(this.vertices);
    return this;
  }
}
