// src/lib.rs
use wasm_bindgen::prelude::*;

use crate::vector::Vector;

#[wasm_bindgen(getter_with_clone)]
#[repr(C)]
#[derive(Clone)]
pub struct Particle {
    pub position: Vector,
    pub prev_position: Vector,
    pub velocity: Vector,
}

#[wasm_bindgen]
impl Particle {
    #[wasm_bindgen(constructor)]
    // pub fn new(x:f64,y:f64) -> Particle {
    //     Particle {
    //         position: Vector::new(-1.0,-1.0),
    //     }
    // }
    pub fn new(position: Vector) -> Particle {
        Particle {
            position: position.clone(),
            prev_position: position.clone(),
            velocity: Vector::new(0.0, 0.0),
        }
    }
}


#[wasm_bindgen]
pub fn init_particles()-> *const Particle {
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
    // let particles:Vec<Particle> = (0..20)
    //         .flat_map(|i| {
    //             (0..20).map(move |j| {
    //                 let position_x = i as f64 * particle_offset;
    //                 let position_y = j as f64 * particle_offset;
    //                 Particle::new(position_x * 0.3, position_y * 0.3)
    //             })
    //         })
    //         .collect();
    particles.as_ptr()
}