use std::mem::take;

use wasm_bindgen::prelude::*;

use crate::vector::Vector;

use super::Engine;

const INTERACTION_RADIUS: f64 = 25.0; // 설정에 맞게 조정하세요
const K: f64 = 100.0; // 설정에 맞게 조정하세요
const K_NEAR: f64 = 5000.0; // 설정에 맞게 조정하세요
const REST_DENSITY:f64 = 15.0; // 설정에 맞게 조정하세요

#[wasm_bindgen]
impl Engine {
 pub fn update(&mut self, delta_time: f64) {

        self.apply_gravity();
        
        self.predict_positions(&delta_time);

        self.neighbor_search();

        self.double_density_relaxation(&delta_time);

        self.world_boundary();

        self.compute_next_velocity(&delta_time);
    }

     fn apply_gravity(&mut self) {
        for particle in &mut self.particles {
            particle.velocity.add(&self.gravity);
        }
    }

    fn neighbor_search(&mut self) {
        self.particles = self.fluid_hash_grid.refresh_grid(take(&mut self.particles));
    }

    fn predict_positions(&mut self, delta_time:&f64) {
        let velocity_damping = 1.0;
        for particle in &mut self.particles {
            particle.prev_position = particle.position.clone();
            let position_delta = Vector::scale_vector(&particle.velocity, delta_time * velocity_damping);
            particle.position.add(&position_delta);
        }
    }

    fn double_density_relaxation(&mut self, delta_time:&f64) {
        for i in 0..self.particles.len() {
            let mut density = 0.0;
            let mut density_near = 0.0;

            let neighbors;
            let result = self.fluid_hash_grid.get_neighbor_particles(i,take(&mut self.particles));
            neighbors = result.neighbors;
            self.particles = result.particles;
            // let particle_a = self.particles[i].clone();
            for particle_b in & *neighbors {
                if self.particles[i].id == particle_b.id {
                    continue;
                }

                let rij = Vector::sub_vector(&&self.particles[particle_b.id as usize].position, &self.particles[i].position);
                
                let q = rij.length() / INTERACTION_RADIUS;

                if q < 1.0 {
                    density += (1.0 - q).powf(2.0);
                    density_near += (1.0 - q).powf(3.0);
                }
            }
            
            let pressure = K * (density - REST_DENSITY);
            let pressure_near = K_NEAR * density_near;
            let mut particle_a_displacement = Vector::new(0.0, 0.0);
            
            for particle_b in & *neighbors {
                if self.particles[i].id == particle_b.id {
                    continue;
                }

                let mut rij = Vector::sub_vector(&self.particles[particle_b.id as usize].position,&self.particles[i].position);
                let q = rij.length() / INTERACTION_RADIUS;

                if q < 1.0 {
                    rij.normalize();
                    let displacement_term =
                       delta_time.powf(2.0) * (pressure * (1.0 - q) + pressure_near * (1.0 - q).powf(2.0));
                    let mut d = Vector::scale_vector(&rij, displacement_term);
                     d.scale(0.5);
                     
                    self.particles[particle_b.id as usize].position.add(&d);
                    particle_a_displacement.sub(&d);
                }
            }
            self.particles[i].position.add(&particle_a_displacement);
        }
    }
    
    fn world_boundary(&mut self) {
        for particle in &mut self.particles {
            let position = &mut particle.position;
            let prev_position = &mut particle.prev_position;

            if position.x < 0.0 {
                position.x = 0.0;
                prev_position.x = 0.0;
            }

            if position.x > 700.0 {
                position.x = 700.0;
                prev_position.x = 700.0;
            }

            if position.y < 0.0 {
                position.y = 0.0;
                prev_position.y = 0.0;
            }

            if position.y > 700.0 {
                position.y = 700.0;
                prev_position.y = 700.0;
            }
        }
    }

    fn compute_next_velocity(&mut self, delta_time: &f64) {
        for particle in &mut self.particles {
            let mut velocity = Vector::sub_vector(&particle
                .position, &particle.prev_position);
            velocity.scale(1.0 / delta_time);
            particle.velocity = velocity;
        }
    }
}