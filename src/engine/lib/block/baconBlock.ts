import FixedJoint from '@engine/joints/fixedJoint';
import JointConnection from '@engine/joints/jointConnection';
import Bacon from '../food/solid/bacon';
import { registry } from '../main';
import Rectangle from '../rectangle';
import RigidBody from '../rigidbody';
import Vector, { subVector } from '../vector';

export default class BaconBlock extends RigidBody {
  counter: number;
  baconLength: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), width, height, color), 0);
    this.counter = 0;
    this.baconLength = 6;
    this.shape.draw = () => {
      this.shape.drawUtils.fillRect(
        new Vector({ x: position.x, y: position.y }),
        new Vector({ x: width, y: height }),
        color,
        this.getShape().orientation,
      );
    };
  }

  active() {
    if (this.counter < 1) {
      this.counter++;
      const initIndex = registry.engine.rigidBodies.length;
      for (let i = 0; i < this.baconLength; i++) {
        registry.engine.rigidBodies.push(
          new Bacon(subVector(this.shape.centroid, new Vector({ x: 10 * i, y: 0 }))),
        );
      }

      for (let i = 0; i < this.baconLength; i++) {
        registry.engine.rigidBodies[initIndex + i].shape.createAnchor(new Vector({ x: 5, y: 0 }));
        registry.engine.rigidBodies[initIndex + i].shape.createAnchor(new Vector({ x: -5, y: 0 }));
      }

      for (let i = 1; i < this.baconLength; i++) {
        const jointConnection = new JointConnection(
          registry.engine.rigidBodies[initIndex + i - 1].id,
          registry.engine.rigidBodies[initIndex + i - 1],
          1,
          registry.engine.rigidBodies[initIndex + i].id,
          registry.engine.rigidBodies[initIndex + i],
          0,
        );
        registry.engine.joints.push(new FixedJoint(jointConnection, 5));
      }
    }
  }
}
