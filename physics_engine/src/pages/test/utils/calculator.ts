import Vector, { subVector } from "../lib/vector";

export default class Calculator {
  private static instance: Calculator;

  constructor() {}

  public static getInstance(): Calculator {
    if (!Calculator.instance) {
      Calculator.instance = new Calculator();
    }
    return Calculator.instance;
  }

  // basic concept from : https://en.wikipedia.org/wiki/Polygon
  calcCentroid = (vertices: Vector[]): Vector => {
    let A = this.calcArea(vertices);
    let length = vertices.length;
    let centroid = new Vector({ x: 0, y: 0 });

    for (let i = 0; i < length; i++) {
      let next = this.getIndex(i + 1, length);

      let xterm1 = vertices[i].x + vertices[next].x;
      let xterm2 =
        vertices[i].x * vertices[next].y - vertices[next].x * vertices[i].y;

      centroid.x += xterm1 * xterm2;

      let yterm1 = vertices[i].y + vertices[next].y;
      let yterm2 =
        vertices[i].x * vertices[next].y - vertices[next].x * vertices[i].y;

      centroid.y += yterm1 * yterm2;
    }
    centroid.x /= 6 * A;
    centroid.y /= 6 * A;

    return centroid;
  };

  // 다각형의 넓이를 구함
  calcArea = (vertices: Vector[]) => {
    let A = 0;
    let length = vertices.length;
    for (let i = 0; i < length; i++) {
      let next = this.getIndex(i + 1, length);
      A += vertices[i].x * vertices[next].y - vertices[i].y * vertices[next].x;
    }
    return A / 2;
  };

  getIndex = (index: number, arraySize: number): number => {
    return (index + arraySize) % arraySize;
  };

  rotateAroundPoint(target: Vector, position: Vector, radians: number) {
    let result = new Vector({ x: 0, y: 0 });

    let direction = subVector(target, position);
    result.x =
      direction.x * Math.cos(radians) - direction.y * Math.sin(radians);
    result.y =
      direction.x * Math.sin(radians) + direction.y * Math.cos(radians);
    result.add(position);
    return result;
  }
}
