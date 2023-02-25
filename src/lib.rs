
use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(name);
}

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

// wasm-pack build --target web