import Calculator from '@engine/utils/calculator';
import Effect from '../effect/effect';
import { registry } from '../main';
import RigidBody from '@rigidbody/rigidbody';
import Vector from '../vector';

export default class Component {
  id: number;
  objects: RigidBody[];
  effects: Effect[];
  centroid: Vector;
  orientation: number;

  constructor(position: Vector) {
    this.id = Calculator.getInstance().generateObjectId();
    this.objects = [];
    this.effects = [];
    this.centroid = new Vector(position);
    this.orientation = 0;
  }

  drawComponent() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].shape.draw();
    }
  }

  drawEffect() {
    for (let i = 0; i < this.effects.length; i++) {
      this.effects[i].shape.draw();
    }
  }

  isInside(mousePosition: Vector) {
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].shape.isInside(mousePosition)) return true;
    }
    return false;
  }

  rotate(radian: number) {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].shape.rotate(radian, this.centroid);
    }
    for (let i = 0; i < this.effects.length; i++) {
      this.effects[i].shape.rotate(radian, this.centroid);
    }
    this.orientation += radian;
    this.orientation %= Math.PI * 2;
  }

  select() {
    registry.engine.EditMouseEvent.setSelectComponent(this);
  }
}
