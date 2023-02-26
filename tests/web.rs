//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;
use std::f64::consts::PI;

use snubtitle::VoiceBooster;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[wasm_bindgen_test]
fn not_nan() {
    let sampling_frequency = 1000.0;
    let center_frequency = 150.0;
    let frequency_width = 50.0;

    // Generate test signal with a single frequency component at 200 Hz
    let duration = 1.0; // seconds
    let num_samples = (duration * sampling_frequency) as usize;
    let freq = 200.0;
    let x: Vec<f64> = (0..num_samples)
        .map(|i| (2.0 * PI * freq * (i as f64) / sampling_frequency).sin())
        .collect();
    println!("IN: {:#?}", x);
    let mut booster: VoiceBooster = VoiceBooster::new(sampling_frequency, center_frequency, frequency_width);
    let out = booster.boost_voice(x);
    println!("OUT: {:#?}", out);
}
