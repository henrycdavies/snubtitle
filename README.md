# Snubtitle

**Snubtitle** is a Chromium browser extension that processes the browser's active audio stream in realtime to make voices clearer against other noises in the audio stream.

**NOTE: This is entirely a proof of concept at this stage. The extension does not work at present. This project is in very early stages of development and is only currently contributed to by its original author.**

## Current status

Work on this project has only just begun. Currently, the extension is able to pass a F64 bytes array to our Rust WASM module, which runs a low pass filter on the stream and returns the transformed stream. This is merely a proof of concept. Next steps are to:

* Implement `AudioWorklet` browser API for high-perfomrance audio processing ([see here](https://www.toptal.com/webassembly/webassembly-rust-tutorial-web-audio))
* Read and write audio from the browser ([see here](https://wasmbyexample.dev/examples/reading-and-writing-audio/reading-and-writing-audio.assemblyscript.en-us.html))

Other admin TODOs:

* Linting/formatting/tests
* Build extension on merge to master

## Why

In February 2023, [YouGov released a poll](https://yougov.co.uk/topics/media/survey-results/daily/2023/02/24/9a34f/3) asking the simple question: **When watching TV shows or movies in your native language, do you generally prefer to have the subtitles on or off?**

**28%** of the 3609 British respondents claimed to watch TV shows and movies with subtitles on. A further 4% were unsure (presumably because they do in some cases and don't in others).

When broken down by demographic, the poll demonstrates that a younger and more metropolitan demographic are more likely to use subtitles when watching TV or movies. Most specifically, **65%** of the 18-24 age group use subtitles, compared to **13%** of the 50-64 age group. A larger proportion (**22%**) of the 65+ age group use subtitles, presumably due age-related hearing loss. [This Guardian article](https://www.theguardian.com/tv-and-radio/2023/jan/28/mumbling-actors-bad-speakers-or-lazy-listeners-why-everyone-is-watching-tv-with-subtitles-on) summarises some of the potential reasons why, including mumbling actors and badly-tuned home audio setups.

This poll brought my own subtitle use into sharp focus, and after having seen a smattering of similar sentiments on Reddit and online forums, I thought a good solution would be to implement a Chrome extension to make voices clearer in browser audio.

## Local development

### Requirements

* npm
* wasm-apck
* Chromium-based browser

### Building the Rust binary

```bash
$ wasm-pack build --target web
[INFO]: 🎯  Checking for the Wasm target...
[INFO]: 🌀  Compiling to Wasm...
   Compiling snubtitle v0.1.0 (/projects/snubtitle)
    Finished release [optimized] target(s) in 0.56s
[INFO]: ⬇️  Installing wasm-bindgen...
[INFO]: Optimizing wasm binaries with `wasm-opt`...
[INFO]: Optional fields missing from Cargo.toml: 'description', 'repository', and 'license'. These are not necessary, but recommended
[INFO]: ✨   Done in 0.96s
[INFO]: 📦   Your wasm pkg is ready to publish at /projects/snubtitle/pkg.
[WARN]: ⚠️   There's a newer version of wasm-pack available, the new version is: 0.11.0, you are using: 0.10.3. To update, navigate to: https://rustwasm.github.io/wasm-pack/installer/
```

### Build the extension

```bash
$ npm run build               

> extension@0.1.0 build
> INLINE_RUNTIME_CHUNK=false react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  77.1 kB  build/static/js/main.36a13c62.js
  1.78 kB  build/static/js/787.68f04c53.chunk.js
  541 B    build/static/css/main.073c9b0a.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  https://cra.link/deployment
```

### Import the extension into the browser

* [Google Chrome](https://developer.chrome.com/docs/extensions/mv2/getstarted/)
* [Microsoft Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)