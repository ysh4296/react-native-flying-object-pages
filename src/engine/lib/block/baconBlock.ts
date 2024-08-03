import FixedJoint from '@engine/joints/fixedJoint';
import JointConnection from '@engine/joints/jointConnection';
import Component from '../component/component';
import Bacon from '../food/solid/bacon';
import { registry } from '../main';
import Rectangle from '@rigidbody/rectangle';
import RigidBody from '@rigidbody/rigidbody';
import Vector, { subVector } from '../vector';

export default class BaconBlock extends RigidBody {
  counter: number;
  baconLength: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.counter = 0;
    this.baconLength = 3;
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: width, y: height }),
        color,
        this.getShape().orientation,
      );
    };
  }

  active() {
    this.counter++;
    if (this.counter > 180) {
      this.counter = 0;
      // const initIndex = registry.engine.components.length;
      const component = new Component(this.shape.centroid);
      for (let i = 0; i < this.baconLength; i++) {
        component.objects.push(
          new Bacon(subVector(this.shape.centroid, new Vector({ x: 20 * i, y: 0 }))),
        );
        // registry.engine.rigidBodies.push(
        //   new Bacon(subVector(this.shape.centroid, new Vector({ x: 20 * i, y: 0 }))),
        // );
      }

      for (let i = 0; i < this.baconLength; i++) {
        component.objects[i].shape.createAnchor(new Vector({ x: 10, y: 0 }));
        component.objects[i].shape.createAnchor(new Vector({ x: -10, y: 0 }));
        // registry.engine.rigidBodies[initIndex + i].shape.createAnchor(new Vector({ x: 10, y: 0 }));
        // registry.engine.rigidBodies[initIndex + i].shape.createAnchor(new Vector({ x: -10, y: 0 }));
      }
      registry.engine.components.push(component);
      for (let i = 1; i < this.baconLength; i++) {
        const jointConnection = new JointConnection(
          component.objects[i - 1].id,
          component.objects[i - 1],
          1,
          component.objects[i].id,
          component.objects[i],
          0,
        );
        registry.engine.joints.push(new FixedJoint(jointConnection, 10, 0.8));
      }
    }
  }
}
