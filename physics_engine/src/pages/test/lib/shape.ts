import Draw from "./draw";
import Vector from "./vector";

export default class Shape {
  vertices: Vector[];
  ctx: CanvasRenderingContext2D;
  drawUtils: Draw;
  constructor(ctx: CanvasRenderingContext2D, vertices: Vector[]) {
    this.ctx = ctx;
    this.drawUtils = Draw.getInstance(ctx);
    this.vertices = vertices;
    if (new.target === Shape) {
      throw new TypeError(
        "Cannot construct abstract instances directly of Class 'Shape'"
      );
    }
  }

  draw() {
    for (let i = 1; i < this.vertices.length; i++) {
      this.drawUtils.drawLine(this.vertices[i - 1], this.vertices[i], "black");
    }
    this.drawUtils.drawLine(
      this.vertices[this.vertices.length - 1],
      this.vertices[0],
      "black"
    );
  }
}
