import Shape from "./shape";
import Vector from "./vector";

export default class Polygon extends Shape {
  constructor(ctx: CanvasRenderingContext2D, vertices: Vector[]) {
    super(ctx, vertices);
  }
}
