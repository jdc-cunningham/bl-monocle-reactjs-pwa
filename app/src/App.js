import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/web-bluetooth-repl/js/main';

function App() {
  const [connected, setConnected] = useState(false);

  const logger = (msg) => {
    if (msg === 'Connected') {
      setConnected(true);
    }

    console.log(msg)
  }

  // useEffect(() => {
  //   ensureConnected(logger);
  // }, []);

  return (
    <div className="App">
      <p>{connected ? "connected" : "disconnected"}</p>
      <button type="button" onClick={() => ensureConnected(logger)}>Connect</button>
    </div>
  );
}

export default App;
