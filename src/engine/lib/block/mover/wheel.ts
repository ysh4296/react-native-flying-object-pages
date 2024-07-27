import Circle from '@engine/lib/circle';
import { registry } from '@engine/lib/main';
import Matter from '@engine/lib/matter';
import Vector from '@engine/lib/vector';
import RigidBody from '../../rigidbody';

export default class Wheel extends RigidBody {
  counter: number;
  direction: Vector;
  escalatorConstant: number;
  //   escalatorNumber: number;
  constructor(
    position: Vector,
    radius: number,
    color: string,
    direction: Vector = new Vector({ x: 1, y: 0 }),
    escalatorConstant = 1,
  ) {
    super(new Circle(new Vector({ x: position.x, y: position.y }), radius, color), 0);
    this.counter = 0;
    this.matter = new Matter(0, 0.6);
    this.direction = direction;
    this.escalatorConstant = escalatorConstant;
    registry.engine.rigidBodies.push();
    // this.escalatorNumber = 10;
    // const initIndex = registry.engine.rigidBodies.length;
    // for (let i = 0; i < this.escalatorNumber; i++) {
    //   const chain = new Bacon(
    //     subVector(
    //       this.shape.centroid,
    //       rotateVector(
    //         new Vector({ x: 0, y: registry.engine.GameBoard.cellSize / 2 }),
    //         (2 * Math.PI * i) / this.escalatorNumber,
    //       ),
    //     ),
    //   );
    //   chain.shape.rotate((2 * Math.PI * i) / this.escalatorNumber);
    //   registry.engine.rigidBodies.push(chain);
    // }

    // for (let i = 0; i < this.escalatorNumber; i++) {
    //   registry.engine.rigidBodies[initIndex + i].shape.createAnchor(
    //     rotateVector(new Vector({ x: 10, y: 0 }), (2 * Math.PI * i) / this.escalatorNumber),
    //   );
    //   registry.engine.rigidBodies[initIndex + i].shape.createAnchor(
    //     rotateVector(new Vector({ x: -10, y: 0 }), (2 * Math.PI * i) / this.escalatorNumber),
    //   );
    // }
    // for (let i = 1; i < this.escalatorNumber; i++) {
    //   const jointConnection = new JointConnection(
    //     registry.engine.rigidBodies[initIndex + i - 1].id,
    //     registry.engine.rigidBodies[initIndex + i - 1],
    //     0,
    //     registry.engine.rigidBodies[initIndex + i].id,
    //     registry.engine.rigidBodies[initIndex + i],
    //     1,
    //   );
    //   registry.engine.joints.push(new SpringJoint(jointConnection, 20, 10));
    // }

    // const jointConnection = new JointConnection(
    //   registry.engine.rigidBodies[initIndex + this.escalatorNumber - 1].id,
    //   registry.engine.rigidBodies[initIndex + this.escalatorNumber - 1],
    //   0,
    //   registry.engine.rigidBodies[initIndex].id,
    //   registry.engine.rigidBodies[initIndex],
    //   1,
    // );
    // registry.engine.joints.push(new SpringJoint(jointConnection, 20, 10));
  }

  active() {
    this.angularVelocity = 3;
  }
}
