import init, { VoiceBooster } from 'snubtitle';

function start() {
    init().then(() => {
        console.log('Did init');
        const arr = Array.from({length: 40000}, () => Math.floor(Math.random() * 40));
        const inputs = new Float64Array(arr);
        const booster: VoiceBooster = VoiceBooster.new();
        const outputs = booster.boost_voice(inputs);
        console.log(outputs);
    });
}

start()