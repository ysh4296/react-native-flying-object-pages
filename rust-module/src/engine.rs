mod fluid_engine;

use wasm_bindgen::prelude::*;

use crate::{vector::Vector, particle::Particle, fluid_hash_grid::FluidHashGrid};

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone)]
pub struct Engine {
    gravity: Vector,
    particles: Vec<Particle>,
    fluid_hash_grid: FluidHashGrid,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Helper macro to simplify logging
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
impl Engine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Engine {
        let particle_offset = 10.0;
        let particles:Vec<Particle> = (0..40)
            .flat_map(|i| {
                (0..40).map(move |j| {
                    let position_x = i as f64 * particle_offset;
                    let position_y = j as f64 * particle_offset;
                    Particle::new((i * 40 + j) as f64,Vector::new(position_x, position_y))
                })
            })
            .collect();

        let gravity = Vector::new(0.0,7.0);
        
        Engine {
            particles,
            fluid_hash_grid:FluidHashGrid::new(25.0),
            gravity,
        }
    }

    pub fn particles(&self) -> *const Particle {
        self.particles.as_ptr()
    }
}


