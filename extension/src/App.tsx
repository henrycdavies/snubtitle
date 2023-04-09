import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import logo from './logo.svg';
import './App.css';
import { setupAudio } from './setupAudio';

const useToggle = (initialState: boolean) => {
  const [value, setToggleValue] = useState(initialState);

  const toggle = () => {
    setToggleValue(!value);
  };
  return { value, toggle };
};

function App() {
  const { value: boostingEnabled, toggle: toggleBoostingEnabled } =
    useToggle(false);
  const [boostingIsActive, setBoostingIsActive] = useState(false);

  useEffect(() => {
    if (boostingEnabled) {
      setupAudio((boosted: Float64Array) => console.log(boosted));
      setBoostingIsActive(true);
    } else {
      setBoostingIsActive(false);
    }
  }, [boostingEnabled]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Snubify</h2>
        <Switch onChange={() => toggleBoostingEnabled()}></Switch>
        {boostingIsActive ? <p>Boosted</p> : <p>Not boosted</p>}
      </header>
    </div>
  );
}

export default App;
