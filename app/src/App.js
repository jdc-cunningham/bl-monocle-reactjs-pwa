import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { replRawMode, replSend } from './bluetooth/js/repl';

function App() {
  const [connected, setConnected] = useState(false);
  const [running, setRunning] = useState(false);

  // send to monocle display
  const sendToMonocle = async (replStr) => {
    setRunning(true);
    await replRawMode(true);
    await replSend(replStr);
    setRunning(false);
  }

  const runCmd = (id) => {
    const snippet = document.getElementById(id);

    // https://github.com/siliconwitchery/web-bluetooth-repl/blob/b13ade8c1aa9754e4a2ad917c2d227705c02ef7f/js/repl.js#L269
    let string = '';
    string = snippet.value.replaceAll('\r\n', '\r');
    string = string.replaceAll('\n', '\r');

    sendToMonocle(string);
  }

  const logger = async (msg) => {
    if (msg === 'Connected') {
      setConnected(true);
    }
  }

  return (
    <div className="App">
      <span className="connect">
        <p>{connected ? "connected" : "disconnected"}</p>
        <button type="button" onClick={() => ensureConnected(logger)}>Connect</button>
      </span>
      <div className="container">
        <div className="snippets">
          <div className="snippet">
            <span>
              <button
                type="button"
                className="run"
                disabled={!connected || running}
                onClick={() => runCmd('white')}
              >run</button>
            </span>
            <textarea className="body" id="white" spellCheck="false">
            </textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
