import ProcessorNode, { OutputCallback } from './ProcessorNode';

export async function setupAudio(
  onOutputCallback: OutputCallback<Float64Array, void>
) {
  if (chrome) {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        chrome.tabCapture.capture({ audio: true }, async (stream) => {
          // Create an AudioContext object
          const context = new window.AudioContext();

          let node;

          try {
            // // Fetch the WebAssembly module that performs audio dynamic range compression.
            // const response = await window.fetch('snubtitle/snubtitle_bg.wasm');
            // const wasmBytes = await response.arrayBuffer();

            // Add our audio processor worklet to the context.
            try {
              await context.audioWorklet.addModule(
                'worklet/compression-processor.js'
              );
            } catch (e) {
              const msg = (e as Error).message;
              throw new Error(
                // `Failed to load audio analyzer worklet at url: ${processorUrl}. Further info: ${msg}`
                `${msg}`
              );
            }

            // Create the AudioWorkletNode which enables the main Javascript thread to
            // communicate with the audio processor (which runs in a Worklet).
            node = new ProcessorNode(context, 'compression-processor');

            const numAudioSamplesPerAnalysis = 1024;

            // Send the Wasm module to the audio node which in turn passes it to the
            // processor running in the Worklet thread. Also, pass any configuration
            // parameters for the Wasm detection algorithm.
            node.init(
              // new Float64Array(wasmBytes),
              onOutputCallback,
              numAudioSamplesPerAnalysis
            );

            node.connect(context.destination);
          } catch (err) {
            const msg = (err as Error).message;
            throw new Error(
              `Failed to load audio analyzer WASM module. Further info: ${msg}`
            );
          }

          return { context, node };
        });
      }
    );
  }
}
