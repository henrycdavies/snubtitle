mod utils;
use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct VoiceBooster {}

#[wasm_bindgen]
impl VoiceBooster {
  pub fn new() -> VoiceBooster {
    utils::set_panic_hook();

    VoiceBooster {}
  }

  
  pub fn boost_voice(&mut self, audio_samples: Vec<f64>) -> Vec<f64> {
    audio_samples
  }
}