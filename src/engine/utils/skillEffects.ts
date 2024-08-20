import Charactor from '@engine/lib/game/charactor';
import Frame from '@engine/lib/game/skill/frame';
import Skill from '@engine/lib/game/skill/skill';
import { registry } from '@engine/lib/main';

export interface SkillFrame {
  user: Charactor;
  skill: Skill;
  frame: Frame;
  addTime: number;
}

/**
 * @todo convert waiting & fame to heapq
 */
export default class skillEffects {
  active: SkillFrame[]; // currently activating Skill
  wait: SkillFrame[]; // waiting for activate

  constructor() {
    this.active = [];
    this.wait = [];
  }

  addFrame(user: Charactor, skill: Skill, frame: Frame) {
    this.wait.push({
      user,
      skill,
      frame,
      addTime: registry.gameTime,
    });
  }

  update() {
    this.wait.forEach((skillFrame) => {
      // add active Frame
      if (!skillFrame.frame.isWait(skillFrame.addTime)) {
        this.active.push(skillFrame);
      }
    });

    this.wait = this.wait.filter((skillFrame) => skillFrame.frame.isWait(skillFrame.addTime)); // clear waiting queue

    this.active = this.active.filter((skillFrame) => skillFrame.frame.isAlive(skillFrame.addTime)); // frame out
  }

  draw() {
    this.active.forEach((skillFrame) => skillFrame.frame.draw(skillFrame.user));
  }
}
