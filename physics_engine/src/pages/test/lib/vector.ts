export default class Vector {
  x: number;
  y: number;
  constructor(pos: position) {
    this.x = pos.x;
    this.y = pos.y;
  }

  normalize = () => {
    length = this.length();
    this.x /= length;
    this.y /= length;
  };

  length = () => {
    return Math.sqrt(this.lengthSquare());
  };

  lengthSquare = () => {
    return this.x * this.x + this.y * this.y;
  };

  getOrthogonal = () => {
    return new Vector({ x: this.y, y: -this.x });
  };

  getDotProduct = (target: Vector) => {
    return this.x * target.x + this.y + target.y;
  };

  getCopy = () => {
    return new Vector({ x: this.x, y: this.y });
  };

  add = (vector: Vector) => {
    this.x += vector.x;
    this.y += vector.y;
  };

  sub = (vector: Vector) => {
    this.x -= vector.x;
    this.y -= vector.y;
  };

  scale = (scale: number) => {
    this.x *= scale;
    this.y *= scale;
  };

  cross = (target: Vector) => {
    return this.x * target.y - this.y * target.x;
  };

  log = () => {
    console.log(this);
  };
}

export const addVector = (vector1: Vector, vector2: Vector): Vector => {
  return new Vector({ x: vector1.x + vector2.x, y: vector1.y + vector2.y });
};
export const subVector = (vector1: Vector, vector2: Vector): Vector => {
  return new Vector({ x: vector1.x - vector2.x, y: vector1.y - vector2.y });
};
export const scaleVector = (vector1: Vector, scale: number): Vector => {
  return new Vector({ x: vector1.x * scale, y: vector1.y * scale });
};
