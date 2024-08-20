import Rectangle from '@engine/lib/rigidbody/rectangle';
import Vector from '@engine/lib/vector';
import { BounceAttribute } from '../attribute/attribute';
import Frame from '../skill/frame';
import RangeSkill from '../skill/rangeSkill';
import Skill from '../skill/skill';

export const skillData: Skill[] = [];

const skillFrame: Frame[][] = [];

export const initSkillData = () => {
  skillData.push(new RangeSkill(0).addAttribute(BounceAttribute));
  skillFrame.push([
    new Frame(0, 0, 6, [new Rectangle(new Vector({ x: -50, y: 25 }), 20, 50, 'blue')], {
      source: '/skillEffect/Horizontal_Slash.png',
      width: 48,
      height: 48,
      row: 0,
      column: 0,
    }),
    new Frame(
      0,
      6,
      6,
      [
        new Rectangle(new Vector({ x: -50, y: 20 }), 20, 50, 'blue'),
        new Rectangle(new Vector({ x: -35, y: -25 }), 20, 50, 'blue').rotate(Math.PI / 6),
        new Rectangle(new Vector({ x: 0, y: -60 }), 50, 20, 'blue'),
      ],
      {
        source: '/skillEffect/Horizontal_Slash.png',
        width: 48,
        height: 48,
        row: 0,
        column: 1,
      },
    ),
    new Frame(
      0,
      12,
      12,
      [
        new Rectangle(new Vector({ x: 0, y: -60 }), 50, 20, 'blue'),
        new Rectangle(new Vector({ x: 35, y: -25 }), 20, 50, 'blue').rotate(-Math.PI / 6),
      ],
      {
        source: '/skillEffect/Horizontal_Slash.png',
        width: 48,
        height: 48,
        row: 0,
        column: 2,
      },
    ),
    new Frame(0, 24, 6, [new Rectangle(new Vector({ x: 50, y: 20 }), 20, 20, 'blue')], {
      source: '/skillEffect/Horizontal_Slash.png',
      width: 48,
      height: 48,
      row: 0,
      column: 3,
    }),
    new Frame(0, 30, 6, [], {
      source: '/skillEffect/Horizontal_Slash.png',
      width: 48,
      height: 48,
      row: 0,
      column: 4,
    }),
  ]);

  skillData.forEach((skillData) => {
    if (skillData instanceof RangeSkill) {
      skillData.setFrame(skillFrame[skillData.id]);
    }
  });
};
