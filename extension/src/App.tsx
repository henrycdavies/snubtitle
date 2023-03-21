import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import logo from './logo.svg';
import './App.css';
import init, { VoiceBooster } from 'snubtitle';

const useToggle = (initialState: boolean) => {
  const [value, setToggleValue] = useState(initialState);

  const toggle = () => { setToggleValue(!value) };
  return { value, toggle }
};

function App() {
  const [wasmIsInitted, setWasmIsInitted] = useState(false);
  const { value: boostingEnabled, toggle: toggleBoostingEnabled } = useToggle(false);
  const [boostingIsActive, setBoostingIsActive] = useState(false);

  useEffect(() => {
    init().then(() => {
      setWasmIsInitted(true);
    })
  }, [])

  useEffect(() => {
    if (boostingEnabled) {
      // Move this to service worker
      const booster = VoiceBooster.new();
      const testArr = [100.0,2000.0,30000.0,4000.0,500.0,60.0,7.0];
      const rr = new Float64Array(testArr);
      const outputs = booster.boost_voice(rr);
      setBoostingIsActive(true);
    } else {
      setBoostingIsActive(false);
    }
  }, [boostingEnabled]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>
          Snubify
        </h2>
        {wasmIsInitted && (
          <Switch onChange={() => toggleBoostingEnabled()}></Switch>
        )}
        {boostingIsActive ? (
          <p>Boosted</p>
        ) : (
          <p>Not boosted</p>
        )}
      </header>
    </div>
  );
}

export default App;
