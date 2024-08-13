import { registry } from '@engine/lib/main';
import Vector from '@engine/lib/vector';

export default class GoldGainEffect {
  glodGainTexts: DamageTextType[];
  constructor() {
    this.glodGainTexts = [];
  }

  addGlodGainText(x: number, y: number, value: number) {
    this.glodGainTexts.push({
      x: x,
      y: y,
      value: value,
      alpha: 1, // 완전히 불투명
      lifespan: 180, // 1초 동안 표시
      velocityY: -0.9, // 위로 떠오르는 속도
    });
  }

  updateAndDrawGlodGainTexts() {
    for (let i = this.glodGainTexts.length - 1; i >= 0; i--) {
      const text = this.glodGainTexts[i];

      // 텍스트 위치 및 투명도 업데이트
      text.y += text.velocityY;
      text.alpha =
        1 - registry.engine.calculatorUtils.calculateBezier(1, 0, 1, 0, text.lifespan / 180);
      text.lifespan -= 1;

      // 텍스트 그리기

      registry.engine.drawUtils.ctx.save();
      registry.engine.drawUtils.ctx.font = `20px Arial`;
      registry.engine.drawUtils.ctx.fillStyle = `rgba(255, 207, 64)`; // 빨간색 데미지 텍스트
      registry.engine.drawUtils.drawCenteredText(
        new Vector({ x: text.x, y: text.y - 20 }),
        `+ ${text.value.toString()}`,
      );
      this.drawCoin(text.x, text.y - 70, 15, 25, text.alpha);
      registry.engine.drawUtils.ctx.restore();

      // 텍스트 제거
      if (text.lifespan <= 0 || text.alpha <= 0) {
        this.glodGainTexts.splice(i, 1);
      }
    }
  }

  drawCoin(x: number, y: number, w: number, h: number, alpha: number) {
    var ovalOffset = 0.65,
      ox = (w / 2) * ovalOffset, // control point offset horizontal
      oy = (h / 2) * ovalOffset, // control point offset vertical
      xe = x + w, // x-end
      ye = y + h, // y-end
      xm = x + w / 2, // x-middle
      ym = y + h / 2; // y-middle

    // glowing effect
    const glowingOffset = Math.round(registry.animationOffset / 10) % 3;
    if (glowingOffset == 0) {
      registry.engine.drawUtils.ctx.fillStyle = `rgba(255, 207, 64, ${alpha})`; // light gold color
    } else if (glowingOffset == 1) {
      registry.engine.drawUtils.ctx.fillStyle = `rgba(255, 191, 0, ${alpha})`; // gold color
    } else {
      registry.engine.drawUtils.ctx.fillStyle = `rgba(191, 155, 48, ${alpha})`; // dark gold color
    }

    registry.engine.drawUtils.ctx.beginPath();
    registry.engine.drawUtils.ctx.moveTo(x, ym);
    registry.engine.drawUtils.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    registry.engine.drawUtils.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    registry.engine.drawUtils.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    registry.engine.drawUtils.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

    registry.engine.drawUtils.ctx.fill();
    registry.engine.drawUtils.ctx.closePath(); // not used correctly, see comments (use to close off open path)
  }
}

// 데미지 텍스트 추가 (테스트용)
