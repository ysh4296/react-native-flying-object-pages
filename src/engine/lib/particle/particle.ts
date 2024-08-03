import Vector from '../vector';

export default class Particle {
  position: Vector;
  prevPosition: Vector;
  velocity: Vector;
  color: string;
  constructor(position: Vector, color: string) {
    this.position = position;
    this.prevPosition = position;
    this.velocity = new Vector({ x: 0, y: 0 });
    this.color = color;
  }
}
