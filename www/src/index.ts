import init, { greet } from 'snubtitle';

init().then(() => {
    greet('Henry');
    console.log('OK');
})