import Calculator from "../utils/calculator";
import Draw from "../utils/draw";
import BoundingBox from "./boundingBox";
import Vector from "./vector";

export default class Shape {
  vertices: Vector[];
  drawUtils: Draw;
  calculatorUtils: Calculator;
  centroid: Vector;
  color: string;
  boundingBox: BoundingBox;

  constructor(vertices: Vector[], color: string) {
    this.drawUtils = Draw.getInstance();
    this.calculatorUtils = Calculator.getInstance();
    this.vertices = vertices;
    this.centroid = new Vector({ x: 0, y: 0 });
    this.color = color;
    this.boundingBox = new BoundingBox();
    if (new.target === Shape) {
      throw new TypeError(
        "Cannot construct abstract instances directly of Class 'Shape'"
      );
    }
  }

  setCentroid(position: Vector) {
    this.centroid = position;
  }

  setColor(color: string) {
    this.color = color;
  }

  draw() {
    for (let i = 1; i < this.vertices.length; i++) {
      this.drawUtils.drawLine(
        this.vertices[i - 1],
        this.vertices[i],
        this.color
      );
    }
    this.drawUtils.drawLine(
      this.vertices[this.vertices.length - 1],
      this.vertices[0],
      this.color
    );
    this.drawUtils.drawPoint(this.centroid, 5, this.color);
  }

  move(delta: Vector) {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].add(delta);
    }
    this.centroid.add(delta);
  }

  rotate(radian: number) {
    for (let i = 0; i < this.vertices.length; i++) {
      let rotatedVertice = this.calculatorUtils.rotateAroundPoint(
        this.vertices[i],
        this.centroid,
        radian
      );
      this.vertices[i] = rotatedVertice;
    }
  }

  calculateInertia(mass: number) {
    // 자식 클래스에서 연산
    return 0;
  }

  calculateBoundingBox() {
    let topLeft = new Vector({ x: Number.MAX_VALUE, y: Number.MAX_VALUE });
    let bottomRight = new Vector({ x: Number.MIN_VALUE, y: Number.MIN_VALUE });

    for (let i = 0; i < this.vertices.length; i++) {
      let x = this.vertices[i].x;
      let y = this.vertices[i].y;

      if (x < topLeft.x) {
        topLeft.x = x;
      }
      if (x > bottomRight.x) {
        bottomRight.x = x;
      }
      if (y < topLeft.y) {
        topLeft.y = y;
      }
      if (y > bottomRight.y) {
        bottomRight.y = y;
      }
    }
    this.boundingBox.topLeft = topLeft;
    this.boundingBox.bottomRight = bottomRight;
  }
}
