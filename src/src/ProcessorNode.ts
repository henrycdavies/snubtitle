/**
 * T1 is input to callback. T2 is return type.
 */
interface OutputCallback<T1, T2 = void> {
    (param1: T1): T2;
  }

export default class ProcessorNode extends AudioWorkletNode {
    private sampleSize: number | undefined;
    private onOutputCallback: OutputCallback<Float64Array> | undefined;
    public init(bytes: Float64Array, onOutputCallback: OutputCallback<Float64Array>, sampleSize: number) {
        this.onOutputCallback = onOutputCallback;
        this.sampleSize = sampleSize;

        this.port.onmessage = (event) => this.onmessage(event.data);
    }

    private onmessage(event: Event) {
        if (event.type === 'wasm-module-loaded') {
            this.port.postMessage({
                type: 'init-booster',
                sampleRate: this.context.sampleRate,
                sampleSize: this.sampleSize,
            });
        } else if (event.type === 'boosted') {
            if (this.onOutputCallback) {
                this.onOutputCallback(event.boosted);
            }
        }
    }
}