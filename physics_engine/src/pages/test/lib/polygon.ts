import Shape from "./shape";
import Vector from "./vector";

export default class Polygon extends Shape {
  constructor(ctx: CanvasRenderingContext2D, vertices: Vector[]) {
    super(ctx, vertices);
  }
  draw() {
    let centroid = this.calculatorUtils.calcCentroid(this.vertices);
    super.setCentroid(centroid);
    super.draw();
  }
}
