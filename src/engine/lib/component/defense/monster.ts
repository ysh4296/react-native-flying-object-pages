import Matter from '@engine/lib/matter';
import Vector from '../../vector';
import ImageCircle from '@engine/lib/balls/imageCircle';

export default class Monster extends ImageCircle {
  hp: number;
  constructor(position: Vector, hp: number) {
    super(position);
    this.hp = hp;
    this.matter = new Matter(0.7, 0.4);
  }
}
