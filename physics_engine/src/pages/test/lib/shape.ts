import Calculator from "../utils/calculator";
import Draw from "../utils/draw";
import Vector from "./vector";

export default class Shape {
  vertices: Vector[];
  ctx: CanvasRenderingContext2D;
  drawUtils: Draw;
  calculatorUtils: Calculator;
  centroid: Vector;

  constructor(ctx: CanvasRenderingContext2D, vertices: Vector[]) {
    this.ctx = ctx;
    this.drawUtils = Draw.getInstance(ctx);
    this.calculatorUtils = Calculator.getInstance();
    this.vertices = vertices;
    this.centroid = new Vector({ x: 0, y: 0 });
    if (new.target === Shape) {
      throw new TypeError(
        "Cannot construct abstract instances directly of Class 'Shape'"
      );
    }
  }

  setCentroid(position: Vector) {
    this.centroid = position;
  }

  draw() {
    for (let i = 1; i < this.vertices.length; i++) {
      this.drawUtils.drawLine(this.vertices[i - 1], this.vertices[i], "black");
    }
    this.drawUtils.drawLine(
      this.vertices[this.vertices.length - 1],
      this.vertices[0],
      "black"
    );
    this.drawUtils.drawPoint(this.centroid, 5, "black");
  }

  move(delta: Vector) {
    console.log("move");
    for (let i = 0; i < this.vertices.length; i++) {
      console.log("i  " + i);
      this.vertices[i].add(delta);
      console.log(this.vertices[i].x + "  :  " + this.vertices[i].y);
    }
    this.centroid.add(delta);
  }

  rotate(radian: number) {
    console.log("rotate  : " + radian);
    for (let i = 0; i < this.vertices.length; i++) {
      let rotatedVertice = this.calculatorUtils.rotateAroundPoint(
        this.vertices[i],
        this.centroid,
        radian
      );
      this.vertices[i] = rotatedVertice;
    }
  }
}
