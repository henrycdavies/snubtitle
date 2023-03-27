import init, { VoiceBooster } from 'snubtitle';

class DynamicRangeCompressionProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = (event) => this.onmessage(event.data);
        this.processor = null;
    }

    onMessage(event) {
        switch (event.type) {
            case "load-wasm-module":
                init().then(() => {
                    this.port.postMessage({ type: 'wasm-module-loaded'});
                });
                break;
            case "init-booster":
                this.sampleCount = 0;
                const { sampleRate, sampleSize } = event
                this.samples = new Array(sampleSize).fill(0);
                this.booster = VoiceBooster.new();
                break;
            default:
                break;
        }
    }

    process(inputs, outputs, parameters) {
        /**
         * Most audio bitrates are a power of 2, and > 128.
         * Therefore we can assume that we will receive at minimum
         * 128 samples, or a a multiple 2^n multiple of that.
         */

        // Only one input, active tab output audio
        const inChannels = inputs[0];
        // TODO: (Check browser audio, we may have 2 channels)
        const inSamples = inChannels[0];

        const newSampleCount = inSamples.length;
        const existingSampleCount = this.samples.length - newSampleCount;

        const requiresMoreSamplesBeforeAnalysis = (this.samples.length < this.sampleSize) && (this.sampleSize - this.samples.length - inSamples > 0);


        if (requiresMoreSamplesBeforeAnalysis) {
            this.samples = [...this.samples, ...inSamples];
        } else {
            // Process
            for (let i = 0; i < newSampleCount; i++) {
                this.samples[i] = this.samples[i + newSampleCount];
            }
            // Add the new samples onto the end, into the 128-wide slot vacated by
            // the previous copy.
            for (let i = 0; i < newSampleCount; i++) {
                this.samples[existingSampleCount + i] = inSamples[i];
            }
            this.totalSamples += newSampleCount;
        }

        if (this.totalSamples >= this.sampleSize && this.booster) {
            const boosted = this.booster.boost_voice(this.samples);

            if (boosted.length) {
                this.port.postMessage({ type: 'boosted', boosted });
            }
        }

        // Continue processing
        return true;
    }
}

registerProcessor("dynamic-range-compression-processor", DynamicRangeCompressionProcessor);
