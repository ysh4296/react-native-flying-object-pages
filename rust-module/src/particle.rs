// src/lib.rs
use wasm_bindgen::{prelude::*};

use crate::vector::Vector;

#[wasm_bindgen(getter_with_clone)]
#[repr(C)]
#[derive(Clone)]
pub struct Particle {
    pub id: f64,
    pub position: Vector,
    pub prev_position: Vector,
    pub velocity: Vector,
}

#[wasm_bindgen]
impl Particle {
    #[wasm_bindgen(constructor)]
    pub fn new(id:f64,position: Vector) -> Particle {
        Particle {
            id,
            position: position.clone(),
            prev_position: position.clone(),
            velocity: Vector::new(0.0, 0.0),
        }
    }
}