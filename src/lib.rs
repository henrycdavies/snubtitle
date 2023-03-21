mod utils;
use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;
use biquad::*;

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
    let f0 = 10.hz();
    let fs = 1.khz();

    // Run a low pass filter for now
    
    let coeffs = Coefficients::<f64>::from_params(Type::LowPass, fs, f0, Q_BUTTERWORTH_F64).unwrap();

    let mut biquad1 = DirectForm1::<f64>::new(coeffs);

    let mut output_vec1 = Vec::new();

    for elem in audio_samples {
      output_vec1.push(biquad1.run(elem))
    }
    output_vec1
  }
}