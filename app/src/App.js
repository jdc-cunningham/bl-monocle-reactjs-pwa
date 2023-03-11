import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import WeightLiftingIcon from './assets/icons/uxwing_weight-lifting.svg';
import { execMonocle } from './comms';
import { workoutApp } from './apps/workout/workout';

const App = () => {
  const [activeApp, setActiveApp] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const logger = async (msg) => {
    console.log('repl response', msg);
    if (msg === 'Connected') {
      setConnecting(false);
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

  const connect = () => {
    setConnecting(true);
    ensureConnected(logger);
  }

  const intro = (
    <div className="intro">
      <h1>Monocle PWA</h1>
      {connecting && <p>{connected ? 'Connected' : 'Connecting...'}</p>}
      {!connecting && <button onClick={() => connect()}>Connect</button>}
    </div>
  );

  useEffect(() => {
    if (activeApp) {
      if (activeApp === 'workout') {
        workoutApp.run(execMonocle);
      }
    }
  }, [activeApp]);

  return (
    <div className="App">
      {(!connected && !activeApp) && intro}
      {(connected && !activeApp) && apps}
      {activeApp && loadedApp}
    </div>
  );
};

export default App;
