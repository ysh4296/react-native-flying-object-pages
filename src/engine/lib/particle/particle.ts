import { registry } from '../main';
import Vector from '../vector';

export default class Particle {
  position: Vector;
  velocity: Vector;
  size: number;
  color: string;
  life: number;

  constructor(position: Vector) {
    this.position = position;
    this.velocity = new Vector({ x: Math.random() - 0.5, y: Math.random() - 0.5 });
    this.size = Math.random() * 5 + 2;
    this.color = `rgba(255, 165, 0, ${Math.random()})`; // 오렌지 색상
    this.life = Math.random() * 30 + 90; // 파티클의 수명
  }

  update() {
    this.position.add(this.velocity);
    this.life -= 1;
  }

  draw() {
    registry.engine.drawUtils.ctx.beginPath();
    registry.engine.drawUtils.ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    registry.engine.drawUtils.ctx.fillStyle = this.color;
    registry.engine.drawUtils.ctx.fill();
    registry.engine.drawUtils.ctx.closePath();
  }

  isAlive() {
    return this.life > 0;
  }
}
