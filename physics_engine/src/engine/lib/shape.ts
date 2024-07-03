import Calculator from "../utils/calculator";
import Draw from "../utils/draw";
import BoundingBox from "../optimization/boundingBox";
import Vector, { addVector, subVector } from "./vector";

export default class Shape {
  vertices: Vector[];
  drawUtils: Draw;
  calculatorUtils: Calculator;
  centroid: Vector;
  color: string;
  boundingBox: BoundingBox;
  anchorPoints: Map<number, Vector>;
  normals: Vector[];
  orientation: number;

  constructor(vertices: Vector[], color: string) {
    this.drawUtils = Draw.getInstance();
    this.calculatorUtils = Calculator.getInstance();
    this.vertices = vertices;
    this.centroid = new Vector({ x: 0, y: 0 });
    this.orientation = 0;
    this.color = color;
    this.normals = [];
    this.boundingBox = new BoundingBox();
    if (new.target === Shape) {
      throw new TypeError(
        "Cannot construct abstract instances directly of Class 'Shape'"
      );
    }
    this.anchorPoints = new Map();
  }

  setCentroid(position: Vector) {
    this.centroid = position;
  }

  setColor(color: string) {
    this.color = color;
  }

  createAnchor(anchorPoint: Vector) {
    let id = this.anchorPoints.size;
    this.anchorPoints.set(id, addVector(this.centroid, anchorPoint));
    return id;
  }

  removeAnchor(id: number) {
    let removed = this.anchorPoints.delete(id);
    if (!removed) {
      console.log("not found!");
    }
    return removed;
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

    for (const [, anchor] of this.anchorPoints.entries()) {
      this.drawUtils.drawPoint(anchor, 5, "green");
    }
  }

  move(delta: Vector) {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].add(delta);
    }
    this.centroid.add(delta);

    for (const [id, anchor] of this.anchorPoints.entries()) {
      this.anchorPoints.set(id, addVector(anchor, delta));
    }
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
    for (const [id, anchor] of this.anchorPoints.entries()) {
      let rotatedAnchor = this.calculatorUtils.rotateAroundPoint(
        anchor,
        this.centroid,
        radian
      );
      this.anchorPoints.set(id, rotatedAnchor);
    }

    this.orientation += radian;
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

  isInside(position: Vector) {
    for (let i = 0; i < this.vertices.length; i++) {
      let vertex = this.vertices[i];
      let normal = this.normals[i];
      let vertexToPoint = subVector(position, vertex);
      if (vertexToPoint.getDotProduct(normal) > 0) {
        return false;
      }
    }
    return true;
  }
}
