import Component from '../component/component';
import Bread from '../food/solid/bread';
import { registry } from '../main';
import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';
import Vector, { subVector } from '../vector';

export default class BreadBlock extends RigidBody {
  counter: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.counter = 0;
    this.shape.draw = () => {
      registry.engine.drawUtils.fillRect(
        new Vector({ x: this.shape.centroid.x, y: this.shape.centroid.y }),
        new Vector({ x: width, y: height }),
        color,
        this.getShape().orientation,
      );
    };
  }

  active() {
    this.counter++;
    if (this.counter > 180) {
      const component = new Component(this.shape.centroid);
      component.objects.push(new Bread(subVector(this.shape.centroid, new Vector({ x: 0, y: 0 }))));
      registry.engine.components.push(component);
      this.counter = 0;
      return;
    }
  }
}
