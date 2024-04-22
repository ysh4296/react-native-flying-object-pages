import Draw from "../utils/draw";
import Shape from "./shape";
import Vector from "./vector";

export default class Circle extends Shape {
  position: Vector;
  radius: number;
  drawUtils: Draw;

  constructor(
    ctx: CanvasRenderingContext2D,
    position: Vector,
    radius: number,
    color: string
  ) {
    super(
      ctx,
      [
        new Vector(position),
        new Vector({ x: position.x + radius, y: position.y }),
      ],
      color
    );
    this.position = position;
    this.radius = radius;
    this.drawUtils = Draw.getInstance(ctx);
  }

  draw() {
    this.drawUtils.strokePoint(this.position, this.radius, this.color);
    super.setCentroid(this.position);
    super.draw();
  }
}
