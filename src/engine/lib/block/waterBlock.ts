import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';
import Component from '../component/component';
import Water from '../food/liquid/water';
import { registry } from '../main';
import Vector, { addVector } from '../vector';

export default class WaterBlock extends RigidBody {
  counter: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(new Rectangle(position, width, height, 'blue'), 0);
    this.counter = 0;
    this.shape.draw = () => {
      registry.engine.drawUtils.fillRect(
        position,
        new Vector({ x: width, y: height }),
        color,
        this.shape.orientation,
      );
    };
  }

  active() {
    if (this.counter < 5) {
      this.counter += 1;
      return;
    }

    const component = new Component(this.shape.centroid);
    component.objects.push(new Water(addVector(this.shape.centroid, new Vector({ x: 0, y: 100 }))));
    registry.engine.components.push(component);
    this.counter = 0;
  }
}
