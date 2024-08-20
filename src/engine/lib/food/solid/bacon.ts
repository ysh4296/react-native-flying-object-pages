import FixedJoint from '@engine/joints/fixedJoint';
import Joint from '@engine/joints/joint';
import { registry } from '@engine/lib/main';
import Matter from '@engine/lib/matter';
import Rectangle from '@rigidbody/rectangle';
import Vector from '@engine/lib/vector';
import Food from '../food';

export default class Bacon extends Food {
  temprature: number;
  maxTemprature: number;
  counter: number;
  maxCounter: number;
  constructor(position: Vector) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), 30, 20, 'blue'), 0.04);
    this.temprature = 0;
    this.maxTemprature = 100;
    this.counter = 0;
    this.maxCounter = 1000;

    const baconColor = ['#d69286', '#b04d4d', '#F2C6BA'];
    const cookedColor = ['#e53b3b', '#9f1313', '#eebf77'];

    this.shape.draw = () => {
      registry.engine.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 30, y: 20 }),
        this.shape.calculatorUtils.rgbaToHex(
          this.shape.calculatorUtils.interpolateColor(
            this.shape.calculatorUtils.hexToRgba(baconColor[0]),
            this.shape.calculatorUtils.hexToRgba(cookedColor[0]),
            this.counter / this.maxCounter,
          ),
        ),
        this.getShape().orientation,
      );
      registry.engine.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 30, y: 5 }),
        this.shape.calculatorUtils.rgbaToHex(
          this.shape.calculatorUtils.interpolateColor(
            this.shape.calculatorUtils.hexToRgba(baconColor[1]),
            this.shape.calculatorUtils.hexToRgba(cookedColor[1]),
            this.counter / this.maxCounter,
          ),
        ),
        this.getShape().orientation,
        new Vector({ x: 0, y: -5 }),
      );
      registry.engine.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 30, y: 10 }),
        this.shape.calculatorUtils.rgbaToHex(
          this.shape.calculatorUtils.interpolateColor(
            this.shape.calculatorUtils.hexToRgba(baconColor[2]),
            this.shape.calculatorUtils.hexToRgba(cookedColor[2]),
            this.counter / this.maxCounter,
          ),
        ),
        this.getShape().orientation,
        new Vector({ x: 0, y: 5 }),
      );
    };
    this.matter = new Matter(0.8, 0.5);
  }

  active() {
    if (this.temprature > 90) {
      /** cooking */
      if (this.counter < this.maxCounter) this.counter++;
    }
    if (this.counter > 500) {
      /** cooked */
      this.matter = new Matter(0.2, 0.8);
      const filteredJoints = registry.engine.joints.filter(
        (item: Joint) =>
          item.jointConnection.objectAId === this.id || item.jointConnection.objectBId == this.id,
      );
      filteredJoints.forEach((result) => {
        if (result instanceof FixedJoint) {
          result.jointIteration = 20;
          result.jointCorrection = 0.3;
        }
      });
    }
    /** cooling down */
    if (this.temprature > 0) this.temprature -= 0.06;
  }
}
