/**
 * T1 is input to callback. T2 is return type.
 */
export interface OutputCallback<T1, T2 = void> {
  (param1: T1): T2;
}

interface ProcessorEvent extends Event {
  boosted?: Float64Array;
  message?: string;
  error?: Error;
}

export default class ProcessorNode extends AudioWorkletNode {
  private sampleSize: number | undefined;
  private onOutputCallback: OutputCallback<Float64Array, void> | undefined;
  public init(
    // bytes: Float64Array,
    onOutputCallback: OutputCallback<Float64Array, void>,
    sampleSize: number
  ) {
    this.onOutputCallback = onOutputCallback;
    this.sampleSize = sampleSize;

    this.port.onmessage = (event) => this.onmessage(event.data);
  }

  private onmessage(event: ProcessorEvent) {
    switch (event.type) {
      case 'wasm-module-loaded':
        this.port.postMessage({
          type: 'init-booster',
          sampleRate: this.context.sampleRate,
          sampleSize: this.sampleSize,
        });
        break;
      case 'boosted':
        if (this.onOutputCallback) {
          console.log('boosted: ', event.boosted);
          if (event.boosted) {
            this.onOutputCallback(event.boosted);
          }
        }
        break;
      case 'log':
        console.log(event.message);
        break;
      case 'error':
        if (event.error) {
          console.error(event.error);
        }
        break;
      default:
        console.log('YEET');
    }
  }
}
