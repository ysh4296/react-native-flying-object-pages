import Matter from '@engine/lib/matter';
import Rectangle from '@rigidbody/rectangle';
import Vector from '@engine/lib/vector';
import Food from '../food';
import { registry } from '@engine/lib/main';

export default class Bread extends Food {
  temprature: number;
  maxTemprature: number;
  counter: number;
  maxCounter: number;
  constructor(position: Vector) {
    super(new Rectangle(new Vector({ x: position.x, y: position.y }), 120, 20, 'blue'), 0.1);
    this.temprature = 0;
    this.maxTemprature = 100;
    this.counter = 0;
    this.maxCounter = 2000;
    const breadColor = ['#eec07b'];
    const cookedColor = ['#6d3200'];
    this.shape.draw = () => {
      /** normal bread */
      registry.engine.drawUtils.fillRect(
        this.shape.centroid,
        new Vector({ x: 120, y: 20 }),
        this.shape.calculatorUtils.rgbaToHex(
          this.shape.calculatorUtils.interpolateColor(
            this.shape.calculatorUtils.hexToRgba(breadColor[0]),
            this.shape.calculatorUtils.hexToRgba(cookedColor[0]),
            this.counter / this.maxCounter,
          ),
        ),
        this.getShape().orientation,
      );

      /** cooked bread */
      if (this.counter >= 0) {
        let linearGradient = registry.engine.drawUtils.ctx.createLinearGradient(0, -10, 0, 0);
        linearGradient.addColorStop(0, '#422308');
        linearGradient.addColorStop(this.counter / this.maxCounter, 'rgba(0, 0, 0, 0)');
        // linearGradient.addColorStop(this.counter / this.maxCounter, '#eec07b');
        linearGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        registry.engine.drawUtils.fillRect(
          this.shape.centroid,
          new Vector({ x: 120, y: 10 }),
          linearGradient,
          this.getShape().orientation,
          new Vector({ x: 0, y: -5 }),
        );

        linearGradient = registry.engine.drawUtils.ctx.createLinearGradient(0, 0, 0, 10);

        linearGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        linearGradient.addColorStop(1 - this.counter / this.maxCounter, 'rgba(0, 0, 0, 0)');
        linearGradient.addColorStop(1, '#422308');

        registry.engine.drawUtils.fillRect(
          this.shape.centroid,
          new Vector({ x: 120, y: 10 }),
          linearGradient,
          this.getShape().orientation,
          new Vector({ x: 0, y: 5 }),
        );
      }

      //   let linearGradient: CanvasGradient = this.shape.drawUtils.ctx.createLinearGradient(
      //     0,
      //     0,
      //     5,
      //     0,
      //   );

      //   linearGradient.addColorStop(0, '#6D3200');
      //   linearGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)'); // 파랑, 투명
      //   linearGradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // 파랑, 투명
      //   this.shape.drawUtils.fillRect(
      //     this.shape.centroid,
      //     new Vector({ x: 5, y: 20 }),
      //     linearGradient,
      //     this.getShape().orientation,
      //     new Vector({ x: -57.5, y: 0 }),
      //   );

      //   linearGradient = this.shape.drawUtils.ctx.createLinearGradient(-5, 0, 0, 0);

      //   linearGradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // 파랑, 투명
      //   linearGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)'); // 파랑, 투명
      //   linearGradient.addColorStop(1, '#6D3200');
      //   this.shape.drawUtils.fillRect(
      //     this.shape.centroid,
      //     new Vector({ x: 5, y: 20 }),
      //     linearGradient,
      //     this.getShape().orientation,
      //     new Vector({ x: 57.5, y: 0 }),
      //   );
      //   linearGradient = this.shape.drawUtils.ctx.createLinearGradient(0, 0, 20, 0);

      //   linearGradient.addColorStop(0, '#eec07b');
      //   linearGradient.addColorStop(0.1, '#f0d1a0');

      //   linearGradient.addColorStop(0.6, '#f0d1a0');
      //   linearGradient.addColorStop(1, '#eec07b');
      //   this.shape.drawUtils.fillRect(
      //     this.shape.centroid,
      //     new Vector({ x: 5, y: 20 }),
      //     linearGradient,
      //     this.getShape().orientation,
      //     new Vector({ x: 20, y: 0 }),
      //   );
      //   linearGradient = this.shape.drawUtils.ctx.createLinearGradient(-20, 0, 0, 0);

      //   linearGradient.addColorStop(0, '#eec07b');
      //   linearGradient.addColorStop(0.6, '#f0d1a0');

      //   linearGradient.addColorStop(0.9, '#f0d1a0');
      //   linearGradient.addColorStop(1, '#eec07b');
      //   this.shape.drawUtils.fillRect(
      //     this.shape.centroid,
      //     new Vector({ x: 5, y: 20 }),
      //     linearGradient,
      //     this.getShape().orientation,
      //     new Vector({ x: -20, y: 0 }),
      //   );
    };
    this.matter = new Matter(0.2, 0.8);
  }

  active() {
    if (this.temprature > 90) {
      /** cooking */
      if (this.counter < this.maxCounter) this.counter++;
    }
    /** cooling down */
    if (this.temprature > 0) this.temprature -= 0.06;
  }
}
