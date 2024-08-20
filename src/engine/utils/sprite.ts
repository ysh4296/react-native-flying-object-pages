import Charactor from '@engine/lib/game/charactor';
import { registry } from '@engine/lib/main';
import RigidBody from '@engine/lib/rigidbody/rigidbody';
import Vector, { rotateVector, subVector } from '@engine/lib/vector';

// load image await https://stackoverflow.com/questions/46399223/async-await-in-image-loading
export default class Sprite {
  spriteSheet: HTMLImageElement;
  skillSpriteSheet: HTMLImageElement;
  constructor() {
    this.spriteSheet = new Image();
    this.skillSpriteSheet = new Image();
  }

  // 비동기 초기화 메서드
  async init(
    src: string = '/Basic_Asset_Pack/Basic_Humanoid_Sprites/Basic Humanoid Sprites 4x.png',
  ) {
    this.spriteSheet.src = src;
    this.skillSpriteSheet.src = '/skillEffect/Horizontal_Slash.png';
    // this.skillSpriteSheet.src = src;
    // await this.loadImage(this.spriteSheet);
    console.log('ru1');
    // await this.loadImage(this.skillSpriteSheet);
    console.log('ru2');
  }

  // 이미지를 Promise로 로드하는 비동기 함수
  // loadImage(img: HTMLImageElement): Promise<void> {
  //   console.log('load');
  //   return new Promise((resolve, reject) => {
  //     img.onload = () => {
  //       console.log('loadCompleted');
  //       resolve();
  //     };
  //     img.onerror = (err) => {
  //       console.error(`Failed to load image: ${img.src}`, err);
  //       reject(err);
  //     };
  //   });
  // }

  drawSprite(rotation?: number, translation?: Vector) {
    // 이미지가 로드된 후 작업을 진행
    const spriteWidth = 72; // 스프라이트의 너비
    const spriteHeight = 72; // 스프라이트의 높이
    const spriteIndex = 8;
    const columns = 5; // 스프라이트 시트의 열 수

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

  newDrawSprite(object: RigidBody, spriteConfiguration: spriteConfiguration) {
    // 이미지가 로드된 후 작업을 진행
    const spriteWidth = spriteConfiguration.width; // 스프라이트의 너비
    const spriteHeight = spriteConfiguration.height; // 스프라이트의 높이

    const col = spriteConfiguration.column;
    const row = spriteConfiguration.row;

    let rotation: number = 0;

    if (object.velocity.length() > 10) {
      rotation = registry.engine.calculatorUtils.getAngleBetweenVectors(
        new Vector({ x: 0, y: 1 }),
        object.velocity,
      );
    }
    const translation = subVector(
      object.shape.centroid,
      rotateVector(new Vector({ x: 25, y: 25 }), rotation),
    );

    const sx = col * spriteWidth;
    const sy = row * spriteHeight;
    registry.engine.drawUtils.ctx.save();
    registry.engine.drawUtils.ctx.translate(translation.x, translation.y);
    registry.engine.drawUtils.ctx.rotate(rotation);

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

  skillDraw(
    user: Charactor,
    skillEffectComponent: RigidBody,
    spriteConfiguration: spriteConfiguration,
  ) {
    // 이미지가 로드된 후 작업을 진행
    const spriteWidth = spriteConfiguration.width; // 스프라이트의 너비
    const spriteHeight = spriteConfiguration.height; // 스프라이트의 높이

    const col = spriteConfiguration.column;
    const row = spriteConfiguration.row;

    let rotation = 0;
    let translation = new Vector({ x: 0, y: 0 });

    rotation = user.object.shape.orientation - Math.PI / 2;
    translation = subVector(
      user.object.shape.centroid,
      rotateVector(new Vector({ x: 100, y: 100 }), rotation),
    );

    registry.engine.drawUtils.ctx.save();
    registry.engine.drawUtils.ctx.translate(
      user.object.shape.centroid.x,
      user.object.shape.centroid.y,
    );

    // skillEffectComponent.shape.draw();
    registry.engine.drawUtils.ctx.restore();

    // if (object.velocity.length() > 10) {
    //   rotation = registry.engine.calculatorUtils.getAngleBetweenVectors(
    //     new Vector({ x: 0, y: 1 }),
    //     object.velocity,
    //   );
    // }
    const sx = col * spriteWidth;
    const sy = row * spriteHeight;
    registry.engine.drawUtils.ctx.save();

    registry.engine.drawUtils.ctx.translate(translation.x, translation.y);

    registry.engine.drawUtils.ctx.rotate(rotation);
    // registry.engine.drawUtils.ctx.strokeRect(0, 0, 200, 200);
    registry.engine.drawUtils.ctx.drawImage(
      this.skillSpriteSheet,
      sx,
      sy,
      spriteWidth,
      spriteHeight,
      0,
      0,
      200,
      200,
    );

    registry.engine.drawUtils.ctx.restore();
  }
}
