import { useState } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import WeightLiftingIcon from './assets/icons/uxwing_weight-lifting.svg';

const App = () => {
  const [activeApp, setActiveApp] = useState(false);
  const [connected, setConnected] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const logger = async (msg) => {
    if (msg === 'Connected') {
      setConnected(true);
    }
  };

  const loadedApp = (
    <div className="loaded-app">
      <h2>Active app: {activeApp}</h2>
      <button type="button" onClick={() => setActiveApp(false)}>Back to apps</button>
    </div>
  );

  const apps = (
    <div className="apps-container">
      <div className="apps">
        <div className="app" onClick={() => setActiveApp('workout')}>
          <div className="app-img" style={{backgroundImage: `url(${WeightLiftingIcon})`}}></div>
          <p>Workout</p>
        </div>
      </div>
      <div className="apps-title">
        <h2>Monocle Apps</h2>
      </div>
    </div>
  );

  const intro = (
    <div className="intro">
      <h1>Monocle PWA</h1>
      {connecting && <p>{connected ? 'Connected' : 'Connecting...'}</p>}
      {!connecting && <button onClick={() => ensureConnected(logger)}>Connect</button>}
    </div>
  );

  return (
    <div className="App">
      {(!connected && !activeApp) && intro}
      {(connected && !activeApp) && apps}
      {activeApp && loadedApp}
    </div>
  );
};

export default App;
