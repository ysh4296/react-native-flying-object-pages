import { registry } from '@engine/lib/main';
import Vector from '@engine/lib/vector';

// 전체 애니메이션 정보를 로드하고, looped animation을 실행합니다.
export default class Animation {
  spriteSheet: HTMLImageElement;
  animationConfig: CharactorAnimationConfig;

  constructor() {
    this.spriteSheet = new Image();

    /**
     * @todo
     * read json Data
     */
    this.animationConfig = {
      graphic: 'Fireball.png',
      frames: {
        idle: [
          {
            x: 0,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
          {
            x: 16,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
          {
            x: 32,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
          {
            x: 48,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
          {
            x: 64,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
          {
            x: 80,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
          {
            x: 96,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
          {
            x: 112,
            y: 0,
            width: 16,
            height: 16,
            frameRate: 10,
          },
        ],
        damage: [
          {
            x: 128,
            y: 0,
            width: 64,
            height: 64,
            frameRate: 5,
          },
        ],
        skill: [],
      },
    };
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

  drawAnimation(
    state: CharactorState,
    frameNumber: number,
    rotation?: number,
    translation?: Vector,
  ) {
    // 이미지가 로드된 후 작업을 진행
    registry.engine.drawUtils.ctx.save();
    if (translation) registry.engine.drawUtils.ctx.translate(translation.x, translation.y);
    if (rotation) registry.engine.drawUtils.ctx.rotate(rotation);
    const sprite = this.animationConfig.frames[state][frameNumber];
    registry.engine.drawUtils.ctx.drawImage(
      this.spriteSheet,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height,
      0,
      0,
      50,
      50,
    );

    registry.engine.drawUtils.ctx.restore();
  }
}
