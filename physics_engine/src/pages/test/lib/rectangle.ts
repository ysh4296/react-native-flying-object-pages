import Draw from "./draw";
import Shape from "./shape";
import Vector from "./vector";

export default class Rectangle extends Shape {
  position: Vector;
  width: number;
  height: number;
  drawUtils: Draw;
  constructor(
    ctx: CanvasRenderingContext2D,
    position: Vector,
    width: number,
    height: number
  ) {
    super(ctx, [
      new Vector({ x: position.x - width / 2, y: position.y - height / 2 }),
      new Vector({ x: position.x + width / 2, y: position.y - height / 2 }),
      new Vector({ x: position.x + width / 2, y: position.y + height / 2 }),
      new Vector({ x: position.x - width / 2, y: position.y + height / 2 }),
    ]);
    this.drawUtils = Draw.getInstance(ctx);
    this.position = position;
    this.width = width;
    this.height = height;
  }
}
