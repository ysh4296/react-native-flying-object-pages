import Shape from "./shape";
import Vector, { addVector, scaleVector, subVector } from "./vector";

export default class Polygon extends Shape {
  normals: Vector[];

  constructor(
    ctx: CanvasRenderingContext2D,
    vertices: Vector[],
    color: string
  ) {
    super(ctx, vertices, color);
    this.normals = this.calculatorUtils.calcNormals(this.vertices);
  }

  draw() {
    let centroid = this.calculatorUtils.calcCentroid(this.vertices);
    super.setCentroid(centroid);
    super.draw();
    for (let i = 0; i < this.normals.length; i++) {
      let next = this.calculatorUtils.getIndex(i + 1, this.vertices.length);
      let direction = subVector(this.vertices[next], this.vertices[i]);
      let tail = addVector(this.vertices[i], scaleVector(direction, 1 / 2.0));
      let head = addVector(tail, scaleVector(this.normals[i], 10));
      this.drawUtils.drawArrow(head, tail, "blue");
    }
  }
  rotate(radian: number) {
    super.rotate(radian);
    this.normals = this.calculatorUtils.calcNormals(this.vertices);
  }
}
