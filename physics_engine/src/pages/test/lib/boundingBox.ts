import Draw from "../utils/draw";
import Vector from "./vector";

export default class BoundingBox {
  topLeft: Vector;
  bottomRight: Vector;
  drawUtils: Draw;

  constructor() {
    this.topLeft = new Vector({ x: 0, y: 0 });
    this.bottomRight = new Vector({ x: 100, y: 100 });
    this.drawUtils = Draw.getInstance();
  }

  intersect() {}

  draw() {
    this.drawUtils.drawLine(
      this.topLeft,
      new Vector({ x: this.bottomRight.x, y: this.topLeft.y }),
      "green"
    );
    this.drawUtils.drawLine(
      new Vector({ x: this.bottomRight.x, y: this.topLeft.y }),
      this.bottomRight,
      "green"
    );
    this.drawUtils.drawLine(
      this.bottomRight,
      new Vector({ x: this.topLeft.x, y: this.bottomRight.y }),
      "green"
    );
    this.drawUtils.drawLine(
      new Vector({ x: this.topLeft.x, y: this.bottomRight.y }),
      this.topLeft,
      "green"
    );
  }
}
