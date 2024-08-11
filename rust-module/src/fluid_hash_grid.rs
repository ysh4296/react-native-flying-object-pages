use std::collections::HashMap;
use wasm_bindgen::prelude::*;

use crate::{particle::Particle, vector::Vector};

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone)]
pub struct ParticleVectors {
    pub particles: Vec<Particle>,
    pub neighbors: Vec<Particle>,
}
#[wasm_bindgen]
#[derive(Clone)]
pub struct FluidHashGrid {
    hash_map: HashMap<u64, Vec<Particle>>,
    hash_map_size: u64,
    p1_prime: u64,
    p2_prime: u64,
    cell_size: f64,
}

#[wasm_bindgen]
impl FluidHashGrid {
    #[wasm_bindgen(constructor)]
    pub fn new(cell_size: f64) -> FluidHashGrid {
        FluidHashGrid {
            hash_map: HashMap::new(),
            hash_map_size: 1000000,
            p1_prime: 661401,
            p2_prime: 752887,
            cell_size,
        }
    }

    pub fn refresh_grid(&mut self, particles:Vec<Particle>) -> Vec<Particle> {
        self.clear_grid();
        self.map_particles_to_cell(particles)
    }

    pub fn clear_grid(&mut self) {
        self.hash_map.clear();
    }

    pub fn map_particles_to_cell(&mut self, particles:Vec<Particle>) -> Vec<Particle> {
        for particle in &particles {
            let position = &particle.position;
            let hash = self.get_grid_id_from_position(position);
            self.hash_map.entry(hash).or_insert(Vec::new()).push(particle.clone());
        }
        particles
    }

    pub fn get_neighbor_particles(&self, particle_id: usize, particles:Vec<Particle>) -> ParticleVectors {
        let mut neighbors = Vec::new();
        let pos = &particles[particle_id].position;
        let x = (pos.x / self.cell_size).floor() as i64;
        let y = (pos.y / self.cell_size).floor() as i64;

        for i in -1..=1 {
            for j in -1..=1 {
                let grid_x = x + i;
                let grid_y = y + j;
                let content = self.get_particles_of_cell(self.cell_index_to_hash(grid_x, grid_y));
                neighbors.extend(content);
            }
        }

        ParticleVectors { particles:particles, neighbors:neighbors }
    }

    pub fn get_particles_of_cell(&self, id: u64) -> Vec<Particle> {
        self.hash_map.get(&id).cloned().unwrap_or_else(Vec::new)
    }

    pub fn get_grid_id_from_position(&self, pos: &Vector) -> u64 {
        let x = (pos.x / self.cell_size).floor() as i64;
        let y = (pos.y / self.cell_size).floor() as i64;
        self.cell_index_to_hash(x, y)
    }

    pub fn cell_index_to_hash(&self, x: i64, y: i64) -> u64 {
        ((x as u64 * self.p1_prime) ^ (y as u64 * self.p2_prime)) % self.hash_map_size
    }
}
