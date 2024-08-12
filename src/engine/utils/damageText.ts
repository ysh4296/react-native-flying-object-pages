import { registry } from '@engine/lib/main';

export default class DamageText {
  damageTexts: DamageTextType[];
  constructor() {
    this.damageTexts = [];
  }

  addDamageText(x: number, y: number, value: number) {
    this.damageTexts.push({
      x: x,
      y: y,
      value: value,
      alpha: 1, // 완전히 불투명
      lifespan: 1000, // 1초 동안 표시
      velocityY: -0.5, // 위로 떠오르는 속도
    });
  }

  updateAndDrawDamageTexts() {
    for (let i = this.damageTexts.length - 1; i >= 0; i--) {
      const text = this.damageTexts[i];

      // 텍스트 위치 및 투명도 업데이트
      text.y += text.velocityY;
      text.alpha -= 0.02;
      text.lifespan -= 16; // 대략 16ms (60fps) 간격으로 감소

      const textSize = registry.engine.calculatorUtils.clamp(text.value / 2, 32, 16);
      // 텍스트 그리기
      registry.engine.drawUtils.ctx.font = `${textSize}px Arial`;
      registry.engine.drawUtils.ctx.fillStyle = `rgba(0, 0, 0, ${text.alpha})`; // 빨간색 데미지 텍스트
      registry.engine.drawUtils.ctx.fillText(text.value.toString(), text.x, text.y);

      // 텍스트 제거
      if (text.lifespan <= 0 || text.alpha <= 0) {
        this.damageTexts.splice(i, 1);
      }
    }
  }

  addEvent() {
    registry.engine.canvas.addEventListener('click', (e) => {
      this.addDamageText(e.clientX, e.clientY, Math.floor(Math.random() * 100));
    });
  }
}

// 데미지 텍스트 추가 (테스트용)
