// import '../TextEncoder';
// import init, { VoiceBooster } from '../audio/snubtitle.js';

// class CompressionProcessor extends AudioWorkletProcessor {
//   constructor() {
//     super();
//     console.log('HEUURGGHH');
//     this.port.onmessage = (event) => this.onmessage(event.data);
//     this.processor = null;
//   }

//   onMessage(event) {
//     switch (event.type) {
//       case 'load-wasm-module':
//         init().then(() => {
//           this.port.postMessage({ type: 'wasm-module-loaded' });
//         });
//         break;
//       case 'init-booster':
//         this.sampleCount = 0;
//         const { sampleRate, sampleSize } = event;
//         this.samples = new Array(sampleSize).fill(0);
//         this.booster = VoiceBooster.new();
//         // // Move this to service worker
//         // const booster = VoiceBooster.new();
//         // const testArr = [100.0, 2000.0, 30000.0, 4000.0, 500.0, 60.0, 7.0];
//         // const rr = new Float64Array(testArr);
//         // const outputs = booster.boost_voice(rr);
//         // console.log(outputs);
//         break;
//       default:
//         break;
//     }
//   }

//   process(inputs, outputs, parameters) {
//     /**
//      * Most audio bitrates are a power of 2, and > 128.
//      * Therefore we can assume that we will receive at minimum
//      * 128 samples, or a a multiple 2^n multiple of that.
//      */

//     // Only one input, active tab output audio
//     const inChannels = inputs[0];
//     // TODO: (Check browser audio, we may have 2 channels)
//     const inSamples = inChannels[0];

//     const newSampleCount = inSamples.length;
//     const existingSampleCount = this.samples.length - newSampleCount;

//     const requiresMoreSamplesBeforeAnalysis =
//       this.samples.length < this.sampleSize &&
//       this.sampleSize - this.samples.length - inSamples > 0;

//     if (requiresMoreSamplesBeforeAnalysis) {
//       this.samples = [...this.samples, ...inSamples];
//     } else {
//       // Process
//       for (let i = 0; i < newSampleCount; i++) {
//         this.samples[i] = this.samples[i + newSampleCount];
//       }
//       // Add the new samples onto the end, into the 128-wide slot vacated by
//       // the previous copy.
//       for (let i = 0; i < newSampleCount; i++) {
//         this.samples[existingSampleCount + i] = inSamples[i];
//       }
//       this.totalSamples += newSampleCount;
//     }

//     if (this.totalSamples >= this.sampleSize && this.booster) {
//       const boosted = this.booster.boost_voice(this.samples);

//       if (boosted.length) {
//         this.port.postMessage({ type: 'boosted', boosted });
//       }
//     }

//     // Continue processing
//     return true;
//   }
// }

// registerProcessor('compression-processor', CompressionProcessor);

// Copyright (c) 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * A AudioWorklet-based BitCrusher demo from the spec example.
 *
 * @class BitCrusherProcessor
 * @extends AudioWorkletProcessor
 * @see https://webaudio.github.io/web-audio-api/#the-bitcrusher-node
 */
class CompressionProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bitDepth', defaultValue: 12, minValue: 1, maxValue: 16 },
      {
        name: 'frequencyReduction',
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1,
      },
    ];
  }

  constructor() {
    super();
    this.phase_ = 0;
    this.lastSampleValue_ = 0;
    this.isPlaying = true;
    this.port.onmessage = this.onmessage.bind(this);
  }

  log(message) {
    this.port.postMessage({ type: 'log', message: 'FOOEY' });
  }

  error(error) {
    this.port.postMessage({ type: 'error', error });
  }

  onmessage(event) {
    const { data } = event;
    this.isPlaying = data;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    // AudioParam array can be either length of 1 or 128. Generally, the code
    // should prepare for both cases. In this particular example, |bitDepth|
    // AudioParam is constant but |frequencyReduction| is being automated.
    const bitDepth = parameters.bitDepth;
    const frequencyReduction = parameters.frequencyReduction;
    const isBitDepthConstant = bitDepth.length === 1;

    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      let step = Math.pow(0.5, bitDepth[0]);
      for (let i = 0; i < inputChannel.length; ++i) {
        // We only take care |bitDepth| because |frequencuReduction| will always
        // have 128 values.
        if (!isBitDepthConstant) {
          step = Math.pow(0.5, bitDepth[i]);
        }
        this.phase_ += frequencyReduction[i];
        if (this.phase_ >= 1.0) {
          this.phase_ -= 1.0;
          this.lastSampleValue_ =
            step * Math.floor(inputChannel[i] / step + 0.5);
        }
        outputChannel[i] = this.lastSampleValue_;
      }
    }

    return this.isPlaying;
  }
}

registerProcessor('compression-processor', CompressionProcessor);
