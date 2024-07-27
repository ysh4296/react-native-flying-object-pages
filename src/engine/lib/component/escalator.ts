import JointConnection from '@engine/joints/jointConnection';
import SpringJoint from '@engine/joints/springJoint';
import Plate from '../block/mover/plate';
import Wheel from '../block/mover/wheel';
import { registry } from '../main';
import Vector, { rotateVector, subVector } from '../vector';

export default class Escalator {
  start: Wheel;
  end: Wheel;
  escalatorNumber: number;
  bodyLength: number;
  rotation: number;

  constructor(startPosition: Vector, endPosition: Vector, escalatorNumber: number = 6) {
    this.start = new Wheel(startPosition, registry.engine.GameBoard.cellSize / 2, 'red');
    this.end = new Wheel(endPosition, registry.engine.GameBoard.cellSize / 2, 'red');
    this.escalatorNumber = escalatorNumber;
    this.bodyLength = subVector(startPosition, endPosition).length();
    this.rotation = registry.engine.calculatorUtils.getAngleBetweenVectors(
      new Vector({ x: 1, y: 0 }),
      subVector(endPosition, startPosition),
    );
  }

  addEscalator() {
    registry.engine.rigidBodies.push(this.start);
    registry.engine.rigidBodies.push(this.end);

    const circleNumber = this.escalatorNumber;
    const straightNumber = Math.floor(
      (this.escalatorNumber * this.bodyLength) / (Math.PI * registry.engine.GameBoard.cellSize),
    );

    const initIndex = registry.engine.rigidBodies.length;
    for (let i = 0; i < circleNumber; i++) {
      const chain = new Plate(
        subVector(
          this.start.shape.centroid,
          rotateVector(
            new Vector({ x: 0, y: registry.engine.GameBoard.cellSize / 2 }),
            (2 * Math.PI * i) / circleNumber,
          ),
        ),
        50,
        20,
      );
      if (i == 0) {
        for (let j = 0; j < straightNumber; j++) {
          const rchain = new Plate(
            subVector(
              this.start.shape.centroid,
              new Vector({
                x: (-this.bodyLength / straightNumber) * j,
                y: registry.engine.GameBoard.cellSize / 2,
              }),
            ),
            50,
            20,
          );
          rchain.shape.rotate(this.rotation, this.start.shape.centroid);
          registry.engine.rigidBodies.push(rchain);
        }
      }
      if (i == circleNumber / 2) {
        for (let j = 0; j < straightNumber; j++) {
          const lchain = new Plate(
            subVector(
              this.start.shape.centroid,
              rotateVector(
                new Vector({
                  x: this.bodyLength - (this.bodyLength / straightNumber) * j,
                  y: registry.engine.GameBoard.cellSize / 2,
                }),
                Math.PI,
              ),
            ),
            50,
            20,
          );
          lchain.shape.rotate(Math.PI);
          lchain.shape.rotate(this.rotation, this.start.shape.centroid);
          registry.engine.rigidBodies.push(lchain);
        }
      }

      if (i < circleNumber / 2) {
        chain.shape.move(new Vector({ x: this.bodyLength, y: 0 }));
      } else {
        chain.shape.move(new Vector({ x: 0, y: 0 }));
      }
      chain.shape.rotate((2 * Math.PI * i) / circleNumber);
      chain.shape.rotate(this.rotation, this.start.shape.centroid);
      registry.engine.rigidBodies.push(chain);
    }

    for (let i = 0; i < circleNumber; i++) {
      if (i === 0) {
        for (let j = 0; j < straightNumber; j++) {
          registry.engine.rigidBodies[initIndex + i + j].shape.createAnchor(
            rotateVector(new Vector({ x: 10, y: 0 }), this.rotation),
          );
          registry.engine.rigidBodies[initIndex + i + j].shape.createAnchor(
            rotateVector(new Vector({ x: -10, y: 0 }), this.rotation),
          );
        }
      }
      if (i === circleNumber / 2) {
        for (let j = 0; j < straightNumber; j++) {
          registry.engine.rigidBodies[initIndex + i + j + straightNumber].shape.createAnchor(
            rotateVector(new Vector({ x: 10, y: 0 }), Math.PI + this.rotation),
          );
          registry.engine.rigidBodies[initIndex + i + j + straightNumber].shape.createAnchor(
            rotateVector(new Vector({ x: -10, y: 0 }), Math.PI + this.rotation),
          );
        }
      }
      let pivot;
      if (i < circleNumber / 2) {
        pivot = straightNumber;
      } else {
        pivot = straightNumber * 2;
      }

      registry.engine.rigidBodies[initIndex + pivot + i].shape.createAnchor(
        rotateVector(new Vector({ x: 10, y: 0 }), (2 * Math.PI * i) / circleNumber + this.rotation),
      );
      registry.engine.rigidBodies[initIndex + pivot + i].shape.createAnchor(
        rotateVector(
          new Vector({ x: -10, y: 0 }),
          (2 * Math.PI * i) / circleNumber + this.rotation,
        ),
      );
    }

    for (let i = 1; i < straightNumber * 2 + circleNumber; i++) {
      const jointConnection = new JointConnection(
        registry.engine.rigidBodies[initIndex + i - 1].id,
        registry.engine.rigidBodies[initIndex + i - 1],
        0,
        registry.engine.rigidBodies[initIndex + i].id,
        registry.engine.rigidBodies[initIndex + i],
        1,
      );
      registry.engine.joints.push(new SpringJoint(jointConnection, 40, 10));
    }

    const jointConnection = new JointConnection(
      registry.engine.rigidBodies[initIndex + straightNumber * 2 + circleNumber - 1].id,
      registry.engine.rigidBodies[initIndex + straightNumber * 2 + circleNumber - 1],
      0,
      registry.engine.rigidBodies[initIndex].id,
      registry.engine.rigidBodies[initIndex],
      1,
    );
    registry.engine.joints.push(new SpringJoint(jointConnection, 40, 10));
  }
}
