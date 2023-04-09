use std::f64::consts::PI;

use snubtitle::VoiceBooster;

fn main() {
    let sampling_frequency = 1000.0;

    // Generate test signal with a single frequency component at 200 Hz
    let duration = 1.0; // seconds
    let num_samples = (duration * sampling_frequency) as usize;
    let freq = 200.0;
    let x: Vec<f64> = (0..num_samples)
        .map(|i| (2.0 * PI * freq * (i as f64) / sampling_frequency).sin())
        .collect();
    let mut booster: VoiceBooster = VoiceBooster::new();
    let out = booster.boost_voice(x);
    println!("OUT: {:#?}", out);

}