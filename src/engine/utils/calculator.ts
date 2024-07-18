import Vector, { subVector } from '@engine/lib/vector';

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
      let xterm2 = vertices[i].x * vertices[next].y - vertices[next].x * vertices[i].y;

      centroid.x += xterm1 * xterm2;

      let yterm1 = vertices[i].y + vertices[next].y;
      let yterm2 = vertices[i].x * vertices[next].y - vertices[next].x * vertices[i].y;

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
    result.x = direction.x * Math.cos(radians) - direction.y * Math.sin(radians);
    result.y = direction.x * Math.sin(radians) + direction.y * Math.cos(radians);
    result.add(position);
    return result;
  }

  calcNormals(vertices: Vector[]) {
    let normals: Vector[] = [];
    for (let i = 0; i < vertices.length; i++) {
      let next = this.getIndex(i + 1, vertices.length);
      let direction = subVector(vertices[next], vertices[i]);
      let normal = direction.getNormal();
      normal.normalize();
      normals.push(normal);
    }
    return normals;
  }

  clamp(value: number, max: number, min: number) {
    if (value > max) {
      return max;
    }
    if (value < min) {
      return min;
    }
    return value;
  }

  degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  /**
   * 두 RGBA 색상 값 사이의 중간 색상을 계산하는 함수
   * @param {Array} color1 - 첫 번째 색상, [R, G, B, A]
   * @param {Array} color2 - 두 번째 색상, [R, G, B, A]
   * @param {number} ratio - 중간 색상의 비율 (0에서 1 사이의 값)
   * @returns {Array} - 중간 색상, [R, G, B, A]
   */
  interpolateColor(color1: number[], color2: number[], ratio: number) {
    // 비율이 0보다 작거나 1보다 큰 경우 적절한 범위로 조정
    ratio = Math.min(Math.max(ratio, 0), 1);

    const r = Math.round(color1[0] + ratio * (color2[0] - color1[0]));
    const g = Math.round(color1[1] + ratio * (color2[1] - color1[1]));
    const b = Math.round(color1[2] + ratio * (color2[2] - color1[2]));
    const a = color1[3] + ratio * (color2[3] - color1[3]);

    return [r, g, b, a];
  }

  /**
   * HEX 색상 값을 RGBA 색상 값으로 변환하는 함수
   * @param {string} hex - HEX 색상 값 (예: #RRGGBB 또는 #RRGGBBAA)
   * @returns {Array} - RGBA 색상 값, [R, G, B, A]
   */
  hexToRgba(hex: string) {
    // HEX 색상 값을 정리
    let normalizedHex = hex.replace('#', '');

    // HEX 길이가 6자리인 경우 (RRGGBB)
    if (normalizedHex.length === 6) {
      normalizedHex += 'FF'; // 불투명도 추가
    }

    // R, G, B, A 값을 추출
    const r = parseInt(normalizedHex.slice(0, 2), 16);
    const g = parseInt(normalizedHex.slice(2, 4), 16);
    const b = parseInt(normalizedHex.slice(4, 6), 16);
    const a = parseInt(normalizedHex.slice(6, 8), 16) / 255;

    return [r, g, b, a];
  }

  /**
   * RGBA 색상 값을 HEX 색상 값으로 변환하는 함수
   * @param {number} r - 빨강 값 (0-255)
   * @param {number} g - 초록 값 (0-255)
   * @param {number} b - 파랑 값 (0-255)
   * @param {number} a - 알파 값 (0-1)
   * @returns {string} - HEX 색상 값 (예: #RRGGBBAA)
   */
  rgbaToHex(rgba: number[]) {
    const toHex = (value: number) => {
      const hex = value.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const rHex = toHex(rgba[0]);
    const gHex = toHex(rgba[1]);
    const bHex = toHex(rgba[2]);
    const aHex = toHex(Math.round(rgba[3] * 255));

    return `#${rHex}${gHex}${bHex}${aHex}`;
  }
}
