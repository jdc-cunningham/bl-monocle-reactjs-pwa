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

    let cmdStr = '';

    snippet.querySelectorAll('p').forEach(line => {
      cmdStr += line.innerText + ';';
    });

    sendToMonocle(cmdStr);
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
                disabled={running}
                onClick={() => runCmd('white')}
              >run</button>
            </span>
            <div className="body" id="white">
              <p>import display</p>
              <p>display.text("White text line", 0, 0, 0xffffff)</p>
              <p>display.show()</p>
            </div>
          </div>
          <div className="snippet">
            <span>
              <button
                type="button"
                className="run"
                disabled={running}
                onClick={() => runCmd('green')}
              >run</button>
            </span>
            <div className="body" id="green">
              <p>import display</p>
              <p>display.text("Green text line", 0, 0, 0x00ff00)</p>
              <p>display.show()</p>
            </div>
          </div>
          <div className="snippet">
            <span>
              <button
                type="button"
                className="run"
                disabled={running}
                onClick={() => runCmd('blue')}
              >run</button>
            </span>
            <div className="body" id="blue">
              <p>import display</p>
              <p>display.text("Blue text line", 0, 0, 0x0000ff)</p>
              <p>display.show()</p>
            </div>
          </div>
          <div className="snippet">
            <span>
              <button
                type="button"
                className="run"
                disabled={running}
                onClick={() => runCmd('red')}
              >run</button>
            </span>
            <div className="body" id="red">
              <p>import display</p>
              <p>display.text("Red text line", 0, 0, 0xff0000)</p>
              <p>display.show()</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
