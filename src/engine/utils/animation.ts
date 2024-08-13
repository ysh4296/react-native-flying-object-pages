import { registry } from '@engine/lib/main';
import Vector from '@engine/lib/vector';

export default class Animation {
  spriteSheet: HTMLImageElement;
  animationFrame: number;
  frameDelay: number;
  constructor() {
    this.spriteSheet = new Image();
    this.animationFrame = 0;
    this.frameDelay = 0;
    this.setAnimation(8);
  }

  // 비동기 초기화 메서드
  async init(src: string = '/animation/Fireball.png') {
    this.spriteSheet.src = src;

    await this.loadImage(this.spriteSheet);
  }

  // 이미지를 Promise로 로드하는 비동기 함수
  private loadImage(img: HTMLImageElement): Promise<void> {
    return new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
    });
  }

  setAnimation(animationId: number) {
    this.animationFrame = animationId; // 8프레임
    this.frameDelay = 6; // 프레임당 12초
  }

  drawAnimation(rotation?: number, translation?: Vector) {
    // 이미지가 로드된 후 작업을 진행
    const spriteWidth = 16; // 스프라이트의 너비
    const spriteHeight = 16; // 스프라이트의 높이
    let spriteIndex = registry.gameTime % (this.animationFrame * this.frameDelay);
    spriteIndex = Math.floor(spriteIndex / this.frameDelay);

    const columns = 8; // 스프라이트 시트의 열 수

    const col = spriteIndex % columns;
    const row = Math.floor(spriteIndex / columns);

    const sx = col * spriteWidth;
    const sy = row * spriteHeight;
    registry.engine.drawUtils.ctx.save();
    if (translation) registry.engine.drawUtils.ctx.translate(translation.x, translation.y);
    if (rotation) registry.engine.drawUtils.ctx.rotate(rotation);

    registry.engine.drawUtils.ctx.drawImage(
      this.spriteSheet,
      sx,
      sy,
      spriteWidth,
      spriteHeight,
      0,
      0,
      50,
      50,
    );

    registry.engine.drawUtils.ctx.restore();
  }
}
