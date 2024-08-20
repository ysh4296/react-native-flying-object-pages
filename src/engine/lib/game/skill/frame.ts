import { registry } from '@engine/lib/main';
import RigidBody from '@engine/lib/rigidbody/rigidbody';
import Shape from '@engine/lib/rigidbody/shape';
import Charactor from '../charactor';

/**
 * activated skill frames
 */
export default class Frame {
  private skillId: number; // skill id
  private spriteConfiguration: spriteConfiguration; // imformation for getting sprite
  effectRanges: Shape[];
  private startDelay: number; // frame will go to wait queue
  private duration: number; // frame will excute effect during duration
  constructor(
    skillId: number,
    startDelay: number,
    duration: number,
    effectRanges: Shape[],
    spriteConfiguration: spriteConfiguration,
  ) {
    this.skillId = skillId;
    this.effectRanges = effectRanges;
    this.startDelay = startDelay;
    this.duration = duration; // 120 frame
    this.spriteConfiguration = spriteConfiguration;
  }

  isWait(addTime: number): boolean {
    return addTime + this.startDelay > registry.gameTime;
  }

  isAlive(addTime: number): boolean {
    return this.duration + this.startDelay + addTime > registry.gameTime;
  }

  draw(user: Charactor) {
    /**
     * @todo skill sprite draw
     * draw with spriteConfiguration
     */
    // this.effectRange.draw();
    // 스킬을 누가썼는지를 알아야 스킬을 어디에 배치할지를 알 수 있음
    if (!user) throw Error('noEntity');

    this.effectRanges.forEach((effectRange) => {
      registry.sprite.skillDraw(user, new RigidBody(effectRange), this.spriteConfiguration);
    });
  }

  /**
   * when skill Frame conflict with charactor
   * @param userId
   * @param targetId
   */
  effect(userId: number, targetId: number) {
    // this.skill.attributes?.forEach((attr) => {
    //   /**
    //    * skill attributes applied by user , target information
    //    */
    //   attr.apply(user, target);
    // });
  }

  /**
   * Create a copy of this Frame instance
   * @returns {Frame}
   */
  copy(): Frame {
    return new Frame(
      this.skillId,
      this.startDelay,
      this.duration,
      [...this.effectRanges], // Deep copy the effectRanges array
      { ...this.spriteConfiguration }, // Assuming spriteConfiguration is an object, create a shallow copy
    );
  }
}
