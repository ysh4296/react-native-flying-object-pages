import { registry } from '@engine/lib/main';
import Vector, { addVector, scaleVector, subVector } from '@engine/lib/vector';

export default class Draw {
  ctx: CanvasRenderingContext2D;
  private static instance: Draw;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  public static createInstance(ctx: CanvasRenderingContext2D): Draw {
    if (!Draw.instance) {
      Draw.instance = new Draw(ctx);
    }
    return Draw.instance;
  }

  public static getInstance(): Draw {
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
    this.ctx.lineWidth = 1 / registry.engine.camera.scale;
    this.ctx.beginPath();
    this.ctx.moveTo(startPosition.x, startPosition.y);
    this.ctx.lineTo(endPosition.x, endPosition.y);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  drawText = (position: Vector, size: number, color: string, text: string) => {
    this.ctx.font = size + 'px Arial';
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, position.x, position.y);
  };

  drawArrow = (headPosition: Vector, tailPosition: Vector, color: string) => {
    this.drawLine(headPosition, tailPosition, color);
    const direction: Vector = subVector(headPosition, tailPosition);
    direction.normalize();

    const arrowCenter = subVector(headPosition, scaleVector(direction, 5));

    const OrthoVector = direction.getNormal();

    const leftArrowPoint = addVector(arrowCenter, scaleVector(OrthoVector, 5));
    const rightArrowPoint = subVector(arrowCenter, scaleVector(OrthoVector, 5));

    this.drawLine(headPosition, leftArrowPoint, color);
    this.drawLine(headPosition, rightArrowPoint, color);
  };

  drawRect(position: Vector, size: Vector, color: string) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1 / registry.engine.camera.scale;
    this.ctx.beginPath();
    this.ctx.rect(position.x - size.x / 2, position.y - size.y / 2, size.x, size.y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  fillRect(position: Vector, size: Vector, color: string, rotation = 0) {
    this.ctx.save(); // 현재 상태 저장

    // 캔버스 좌표계를 이동하고 회전
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(rotation);

    this.ctx.fillStyle = color;

    // 사각형의 중심을 기준으로 그리기
    this.ctx.rect(-size.x / 2, -size.y / 2, size.x, size.y);

    this.ctx.fill();

    this.ctx.restore(); // 이전 상태로 복원
  }

  drawCircle(position: Vector, radius: number, color: string) {
    this.ctx.lineWidth = registry.engine.camera.scale;
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }
}
