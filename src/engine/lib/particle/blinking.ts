import { registry } from '../main';
import Vector from '../vector';
import Particle from './particle';

export default class Blinking extends Particle {
  constructor(position: Vector) {
    super(position);
    this.velocity = new Vector({ x: 0, y: 0 });
    this.size = 25;
    this.color = `rgba(255, 0, 0, 1)`; // 오렌지 색상
    this.life = 12; // 파티클의 수명
  }

  update() {
    this.life -= 1;
  }

  draw() {
    registry.engine.drawUtils.ctx.save();
    registry.engine.drawUtils.ctx.beginPath();
    registry.engine.drawUtils.ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    registry.engine.drawUtils.ctx.fillStyle = this.color;
    registry.engine.drawUtils.ctx.fill();
    registry.engine.drawUtils.ctx.closePath();
    registry.engine.drawUtils.ctx.restore();
  }

  isAlive() {
    return this.life > 0;
  }
}
