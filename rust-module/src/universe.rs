use wasm_bindgen::prelude::*;

use crate::{vector::Vector, particle::Particle, fluidHashGrid::FluidHashGrid};


const INTERACTION_RADIUS: f64 = 25.0; // 설정에 맞게 조정하세요
const K: f64 = 100.0; // 설정에 맞게 조정하세요
const K_NEAR: f64 = 5000.0; // 설정에 맞게 조정하세요
const REST_DENSITY:f64 = 10.0; // 설정에 맞게 조정하세요

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone)]
pub struct Universe {
    gravity:Vector,
    particles: Vec<Particle>,
    fluid_hash_grid:FluidHashGrid,
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Universe {
        let particle_offset = 10.0;
        let particles:Vec<Particle> = (0..20)
            .flat_map(|i| {
                (0..20).map(move |j| {
                    let position_x = i as f64 * particle_offset;
                    let position_y = j as f64 * particle_offset;
                    Particle::new(Vector::new(position_x, position_y))
                })
            })
            .collect();

        let fluid_hash_grid = FluidHashGrid::new(25.0);
        let gravity = Vector::new(0.0,0.7);
        Universe {
            particles,
            fluid_hash_grid,
            gravity,
        }
    }

    pub fn particles(&self) -> *const Particle {
        self.particles.as_ptr()
    }

    pub fn update(&mut self) {
        let delta_time:f64 = 1.0 / 60.0 as f64;

        self.apply_gravity();

        self.predict_positions(&delta_time);

        self.neighbor_search();

        self.double_density_relaxation(&delta_time);

        self.world_boundary();

        self.compute_next_velocity(&delta_time);
        print!("{}",delta_time);

    }

    fn apply_gravity(&mut self) {
        for particle in &mut self.particles {
            particle.velocity.add(&self.gravity);
        }
    }

    fn neighbor_search(&mut self) {
        self.fluid_hash_grid.clear_grid();
        self.fluid_hash_grid.map_particles_to_cell(self.particles.clone());
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

            let neighbors = &mut self.fluid_hash_grid.get_neighbor_particles(i,self.particles.clone());
            let particle_a = self.particles[i].clone();

            for particle_b in neighbors {
                if particle_a.position == particle_b.position {
                    continue;
                }

                let rij = Vector::sub_vector(&particle_b.position, &particle_a.position);
                let q = rij.length() / INTERACTION_RADIUS;

                if q < 1.0 {
                    density += (1.0 - q).powi(2);
                    density_near += (1.0 - q).powi(3);
                }
            }

            let pressure = K * (density - REST_DENSITY);
            let pressure_near = K_NEAR * density_near;
            let mut particle_a_displacement = Vector::new(0.0, 0.0);

            let neighbors = &mut self.fluid_hash_grid.get_neighbor_particles(i,self.particles.clone());
            for particle_b in neighbors {
                if particle_a.position == particle_b.position {
                    continue;
                }

                let mut rij = Vector::sub_vector(&particle_b.position,&particle_a.position);
                let q = rij.length() / INTERACTION_RADIUS;

                if q < 1.0 {
                    rij.normalize();
                    let displacement_term =
                       delta_time.powf(2.0) * (pressure * (1.0 - q) + pressure_near * (1.0 - q).powf(2.0));
                    let d = Vector::scale_vector(&rij, displacement_term);

                    let particle_b_move = Vector::scale_vector(&d, 0.5);
                    particle_b.position = Vector::add_vector(&particle_b.position, &particle_b_move);

                    particle_a_displacement = Vector::sub_vector(&particle_a_displacement, &particle_b_move);
                }
            }

            // particle_a.position.add(&particle_a_displacement); 
            self.particles[i].position.add(&particle_a_displacement);
            // self.particles[i].position = Vector::add_vector(&particle_a.position, &particle_a_displacement);
        }
    }
    
    fn world_boundary(&mut self) {
        for particle in &mut self.particles {
            let position = &mut particle.position;

            if position.x < 0.0 {
                position.x = 0.0;
                particle.prev_position.x = 0.0;
            }

            if position.x > 700.0 {
                position.x = 700.0;
                particle.prev_position.x = 700.0;
            }

            if position.y < 0.0 {
                position.y = 0.0;
                particle.prev_position.y = 0.0;
            }

            if position.y > 700.0 {
                position.y = 700.0;
                particle.prev_position.y =700.0;
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