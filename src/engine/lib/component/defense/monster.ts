import imageCircle from '@engine/lib/balls/imageCircle';
import Matter from '@engine/lib/matter';
import { registry } from '../../main';
import Vector from '../../vector';
import Component from '.././component';

export default class Monster extends Component {
  hp: number;
  constructor(position: Vector, hp: number) {
    super(position);
    this.hp = hp;
  }

  addComponent() {
    const sprite = new imageCircle(this.centroid, '');
    sprite.matter = new Matter(0.7, 0.4);
    this.objects.push(sprite);
    registry.engine.components.push(this);
  }
}
