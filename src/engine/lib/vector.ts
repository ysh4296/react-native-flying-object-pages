import { registry } from './main';

export default class Vector {
  x: number;
  y: number;
  this: any;
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

  getNormal = () => {
    return new Vector({ x: this.y, y: -this.x });
  };

  getDotProduct = (target: Vector) => {
    return this.x * target.x + this.y * target.y;
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

  draw(position: Vector = new Vector({ x: 0, y: 0 })) {
    const headPosition = addVector(position, scaleVector(this, 100));
    registry.engine.drawUtils.drawArrow(headPosition, position, 'blue');
  }

  /** the Vector is out from world */
  isOut() {
    let result = false;
    if (
      this.x < 0 ||
      this.x > registry.engine.world.x ||
      this.y < 0 ||
      this.y > registry.engine.world.y
    ) {
      result = true;
    }
    return result;
  }
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

export const crossVector = (vector1: Vector, vector2: Vector): number => {
  return vector1.x * vector2.y - vector1.y * vector2.x;
};

/**
 * rotate Vector1 by {x:0,y:0}
 * @param vector1
 * @param radians
 * @returns rotated Vector
 */
export const rotateVector = (vector1: Vector, radians: number): Vector => {
  let result = new Vector({ x: 0, y: 0 });
  result.x = vector1.x * Math.cos(radians) - vector1.y * Math.sin(radians);
  result.y = vector1.x * Math.sin(radians) + vector1.y * Math.cos(radians);
  return result;
};

/**
 * Project vector u onto vector v
 * @param u The vector to be projected
 * @param v The vector to project onto
 * @returns The projection vector
 */
export const projectVector = (u: Vector, v: Vector): Vector => {
  const dotProduct = u.getDotProduct(v);
  const lengthSquare = v.lengthSquare();
  const scale = dotProduct / lengthSquare;
  return scaleVector(v, scale);
};
