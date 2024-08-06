// src/lib.rs

use wasm_bindgen::prelude::*;
use std::f64::consts::PI;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone,PartialEq)]
pub struct Vector {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
impl Vector {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Vector {
        Vector { x, y }
    }

    pub fn normalize(&mut self) {
        let length = self.length();
        self.x /= length;
        self.y /= length;
    }

    pub fn length(&self) -> f64 {
        self.length_square().sqrt()
    }

    pub fn length_square(&self) -> f64 {
        self.x * self.x + self.y * self.y
    }

    pub fn get_normal(&self) -> Vector {
        Vector::new(self.y, -self.x)
    }

    pub fn get_dot_product(&self, target: &Vector) -> f64 {
        self.x * target.x + self.y * target.y
    }

    pub fn get_copy(&self) -> Vector {
        Vector::new(self.x, self.y)
    }

    pub fn add(&mut self, vector: &Vector) {
        self.x += vector.x;
        self.y += vector.y;
    }

    pub fn sub(&mut self, vector: &Vector) {
        self.x -= vector.x;
        self.y -= vector.y;
    }

    pub fn scale(&mut self, scale: f64) {
        self.x *= scale;
        self.y *= scale;
    }

    pub fn rotate(&mut self, radians: f64, spindle: &Vector) {
        let direction = Vector::sub_vector(self, spindle);
        let new_x = direction.x * radians.cos() - direction.y * radians.sin();
        let new_y = direction.x * radians.sin() + direction.y * radians.cos();
        self.x = new_x + spindle.x;
        self.y = new_y + spindle.y;
    }

    pub fn cross(&self, target: &Vector) -> f64 {
        self.x * target.y - self.y * target.x
    }

    pub fn is_out(&self, max_x: f64, max_y: f64) -> bool {
        self.x < 0.0 || self.x > max_x || self.y < 0.0 || self.y > max_y
    }

    pub fn add_vector(vector1: &Vector, vector2: &Vector) -> Vector {
        Vector::new(vector1.x + vector2.x, vector2.y + vector2.y)
    }

    pub fn sub_vector(vector1: &Vector, vector2: &Vector) -> Vector {
        Vector::new(vector1.x - vector2.x, vector1.y - vector2.y)
    }

    pub fn scale_vector(vector1: &Vector, scale: f64) -> Vector {
        Vector::new(vector1.x * scale, vector1.y * scale)
    }

    pub fn cross_vector(vector1: &Vector, vector2: &Vector) -> f64 {
        vector1.x * vector2.y - vector1.y * vector2.x
    }

    pub fn rotate_vector(vector1: &Vector, radians: f64, spindle: &Vector) -> Vector {
        let direction = Vector::sub_vector(vector1, spindle);
        let new_x = direction.x * radians.cos() - direction.y * radians.sin();
        let new_y = direction.x * radians.sin() + direction.y * radians.cos();
        Vector::new(new_x + spindle.x, new_y + spindle.y)
    }

    pub fn project_vector(u: &Vector, v: &Vector) -> Vector {
        let dot_product = u.get_dot_product(v);
        let length_square = v.length_square();
        let scale = dot_product / length_square;
        Vector::scale_vector(v, scale)
    }
}
