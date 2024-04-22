import Vector, { addVector, scaleVector, subVector } from "./vector";

export default class Draw {
  ctx: CanvasRenderingContext2D;
  private static instance: Draw;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public static getInstance(ctx: CanvasRenderingContext2D): Draw {
    if (!Draw.instance) {
      Draw.instance = new Draw(ctx);
    }
    return Draw.instance;
  }

  drawPoint = (position: Vector, radius: number, color: string) => {
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  };

  strokePoint = (position: Vector, radius: number, color: string) => {
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  drawLine = (startPosition: Vector, endPosition: Vector, color: string) => {
    this.ctx.beginPath();
    this.ctx.moveTo(startPosition.x, startPosition.y);
    this.ctx.lineTo(endPosition.x, endPosition.y);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  drawText = (position: Vector, size: number, color: string, text: string) => {
    this.ctx.font = size + "px Arial";
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, position.x, position.y);
  };

  drawArrow = (headPosition: Vector, tailPosition: Vector, color: string) => {
    this.drawLine(headPosition, tailPosition, color);
    const direction: Vector = subVector(headPosition, tailPosition);
    direction.normalize();
    console.log(direction);
    const arrowCenter = subVector(headPosition, scaleVector(direction, 5));

    const OrthoVector = direction.getOrthogonal();

    const leftArrowPoint = addVector(arrowCenter, scaleVector(OrthoVector, 5));
    const rightArrowPoint = subVector(arrowCenter, scaleVector(OrthoVector, 5));

    this.drawLine(headPosition, leftArrowPoint, "black");
    this.drawLine(headPosition, rightArrowPoint, "black");
  };
}
