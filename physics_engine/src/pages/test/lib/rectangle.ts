import Draw from "../utils/draw";
import Polygon from "./polygon";
import Vector from "./vector";

export default class Rectangle extends Polygon {
  position: Vector;
  width: number;
  height: number;
  constructor(
    ctx: CanvasRenderingContext2D,
    position: Vector,
    width: number,
    height: number,
    color: string
  ) {
    super(
      ctx,
      [
        new Vector({ x: position.x - width / 2, y: position.y - height / 2 }),
        new Vector({ x: position.x + width / 2, y: position.y - height / 2 }),
        new Vector({ x: position.x + width / 2, y: position.y + height / 2 }),
        new Vector({ x: position.x - width / 2, y: position.y + height / 2 }),
      ],
      color
    );
    this.position = position;
    this.width = width;
    this.height = height;
  }
}
