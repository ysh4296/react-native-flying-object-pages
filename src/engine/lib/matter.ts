export default class Matter {
  restitution: number;
  friction: number;
  constructor(restitution = 0.2, friction = 0.3) {
    this.restitution = restitution;
    this.friction = friction;
  }
}
