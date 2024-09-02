import RigidBody from '@rigidbody/rigidbody';
import Circle from '@engine/lib/rigidbody/circle';
import Vector, { rotateVector, subVector } from '@engine/lib/vector';
import { registry } from '@engine/lib/main';

export default class ImageCircle extends RigidBody {
  state: CharactorState;
  frameNumber: number;
  frameOffset: number;

  constructor(position: Vector) {
    super(
      new Circle(new Vector({ x: position.x + Math.random() * 10 - 5, y: position.y }), 25, 'blue'),
      0.04,
    );
    this.state = 'idle';
    this.frameNumber = 0;
    this.frameOffset = 0;

    const originalUpdate = this.update.bind(this);

    this.update = (deltaTime: number) => {
      if (
        this.shape.collisionTime + registry.engine.collisionCache.cooldown * 2 >
        registry.gameTime
      ) {
        originalUpdate(0);
        return;
      }
      originalUpdate(deltaTime);
    };
    /**
     * 캐릭터의 sprite 정보, sprite state, frame number, frame offset 만으로 animation을 그릴 수있어야 합니다.
     * image circle의 draw 로직은 테스트중이며 전체 game object의 기본 draw 로직으로 적용될 예정입니다.
     */
    this.shape.draw = () => {
      if (this.shape.collisionTime + registry.engine.collisionCache.cooldown > registry.gameTime) {
        registry.engine.drawUtils.drawCircle(this.shape.centroid, 25, 'white');
        return;
      }

      let newAngle: number = 0;

      if (this.velocity.length() > 10) {
        newAngle = registry.engine.calculatorUtils.getAngleBetweenVectors(
          new Vector({ x: 0, y: 1 }),
          this.velocity,
        );
      }
      const newStart = subVector(
        this.shape.centroid,
        rotateVector(new Vector({ x: 25, y: 25 }), newAngle),
      );
      // registry.sprite.drawSprite(this.shape.orientation, newStart);
      registry.animation.drawAnimation(this.state, this.frameNumber, newAngle, newStart);

      // loop & charactor state logic
      this.frameOffset++;
      if (
        this.frameOffset ==
        registry.animation.animationConfig.frames[this.state][this.frameNumber].frameRate
      ) {
        this.frameOffset = 0; // reset frameoffset
        // loop and nextframe
        this.frameNumber++;

        if (this.frameNumber === registry.animation.animationConfig.frames[this.state].length) {
          // reset State
          if (this.state !== 'idle') this.state = 'idle';
          this.frameNumber = 0;
        }
      }
    };
  }
}
