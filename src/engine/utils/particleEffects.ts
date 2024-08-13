import Blinking from '@engine/lib/particle/blinking';
import Particle from '@engine/lib/particle/particle';
import Vector from '@engine/lib/vector';

export default class ParticleEffects {
  particles: Particle[];

  constructor() {
    this.particles = [];
  }

  createExplosion(position: Vector, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(position));
    }
  }

  createBlinking(position: Vector) {
    this.particles.push(new Blinking(position));
  }

  update() {
    this.particles = this.particles.filter((p) => p.isAlive());
    this.particles.forEach((p) => p.update());
  }

  draw() {
    this.particles.forEach((p) => p.draw());
  }
}
