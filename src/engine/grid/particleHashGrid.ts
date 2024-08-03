import Particle from '@engine/lib/particle/particle';
import Vector from '@engine/lib/vector';
import Grid from './grid';

export default class FluidHashGrid extends Grid {
  hashMap: Map<number, Particle[]>;
  hashMapSize: number;
  p1Prime: number;
  p2Prime: number;
  particles: Particle[];
  objectsToCells: Map<ParticleCode, number[]>; // particleId

  constructor(cellSize: number) {
    super(cellSize);
    this.hashMap = new Map();
    this.objectsToCells = new Map(); // map<number,rigidBody[]>

    this.hashMapSize = 10000;
    this.p1Prime = 6614058611;
    this.p2Prime = 7528850467;
    this.particles = [];
  }

  initializeParticle(world: Vector, particles: Particle[]) {
    this.world = world;
    this.particles = particles;
  }

  refreshGrid() {
    this.clearGrid();
    this.mapParticlesToCell();
  }

  clearGrid() {
    this.hashMap.clear();
    this.objectsToCells.clear();
  }

  mapParticlesToCell() {
    for (let i = 0; i < this.particles.length; i++) {
      let position = this.particles[i].position;
      let hash = this.getGridIdFromPosition(position);
      let entries = this.getParticlesOfCell(hash);
      if (entries.length === 0) {
        let newArray = [this.particles[i]];
        this.hashMap.set(hash, newArray);
      } else {
        entries.push(this.particles[i]);
      }
    }
  }

  getNeighborParticles(particleId: number) {
    let neighbors: Particle[] = [];
    let pos = this.particles[particleId].position;
    let x = parseInt(String(pos.x / this.cellSize));
    let y = parseInt(String(pos.y / this.cellSize));

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let gridX = x + i;
        let gridY = y + j;
        const content = this.getParticlesOfCell(this.cellIndexToHash(gridX, gridY));
        // neighbors = neighbors.concat(neighbors, content);
        neighbors.push(...content);
      }
    }
    return neighbors;
  }

  getParticlesOfCell(id: number) {
    let content = this.hashMap.get(id);
    if (content === null || content === undefined) return [];
    return content;
  }

  getGridIdFromPosition(pos: Vector) {
    let x = parseInt(String(pos.x / this.cellSize));
    let y = parseInt(String(pos.y / this.cellSize));
    return this.cellIndexToHash(x, y);
  }

  cellIndexToHash(x: number, y: number) {
    let hash = ((x * this.p1Prime) ^ (y * this.p2Prime)) % this.hashMapSize;
    return hash;
  }
}
