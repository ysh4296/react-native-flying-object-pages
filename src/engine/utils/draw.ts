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
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  };

  strokeCircle = (position: Vector, radius: number, color: string) => {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  };

  strokePolygon(vertices: Vector[], color: string) {
    this.ctx.save(); // 현재 상태 저장
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      this.ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore(); // 이전 상태로 복원
  }

  drawLine = (startPosition: Vector, endPosition: Vector, color: string) => {
    this.ctx.save();
    this.ctx.lineWidth = 1 / registry.engine.camera.scale;
    this.ctx.beginPath();
    this.ctx.moveTo(startPosition.x, startPosition.y);
    this.ctx.lineTo(endPosition.x, endPosition.y);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
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

  drawRect(position: Vector, size: Vector, color: string, translation?: Vector) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1 / registry.engine.camera.scale;
    if (translation) {
      this.ctx.translate(translation.x, translation.y);
    }
    this.ctx.rect(position.x - size.x / 2, position.y - size.y / 2, size.x, size.y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  fillRect(
    position: Vector,
    size: Vector,
    color: string | CanvasGradient,
    rotation = 0,
    translation?: Vector,
  ) {
    this.ctx.save(); // 현재 상태 저장
    this.ctx.beginPath();

    // 캔버스 좌표계를 이동하고 회전
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(rotation);
    if (translation) {
      this.ctx.translate(translation.x, translation.y);
    }
    // 사각형의 중심을 기준으로 그리기
    this.ctx.rect(-size.x / 2, -size.y / 2, size.x, size.y);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    this.ctx.closePath();

    this.ctx.restore(); // 이전 상태로 복원
  }

  fillPolygon(vertices: Vector[], color: string) {
    this.ctx.save(); // 현재 상태 저장
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      this.ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore(); // 이전 상태로 복원
  }

  fillCircle(position: Vector, radius: number, color: string, rotation = 0) {
    this.ctx.save(); // 현재 상태 저장this.ctx.beginPath();
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore(); // 이전 상태로 복원
  }

  drawCircle(position: Vector, radius: number, color: string, rotation = 0) {
    this.ctx.save(); // 현재 상태 저장this.ctx.beginPath();
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = registry.engine.camera.scale;
    this.ctx.rotate(rotation);
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore(); // 이전 상태로 복원
  }

  drawDottedLine(
    startPosition: Vector,
    endPosition: Vector,
    color: string,
    animationOffset?: number,
  ) {
    this.ctx.save(); // 현재 상태 저장
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([8, 4]);
    if (animationOffset) this.ctx.lineDashOffset = animationOffset * 2;
    this.ctx.moveTo(startPosition.x, startPosition.y);
    this.ctx.lineTo(endPosition.x, endPosition.y);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore(); // 이전 상태로 복원
  }

  drawCenteredText(center: Vector, text: string) {
    const textWidth = this.ctx.measureText(text).width;
    this.ctx.fillText(text, center.x - textWidth / 2, center.y);
  }
}
