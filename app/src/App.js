import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { replRawMode, replSend } from './bluetooth/js/repl';

function App() {
  const [connected, setConnected] = useState(false);
  const [running, setRunning] = useState(false);
  const [snippet, setSnippet] = useState([
    'import display',
    'display.text("White text line", 0, 0, 0xffffff)',
    'display.show()',
  ].join('\n'));

  // send to monocle display
  const sendToMonocle = async (replStr) => {
    setRunning(true);
    await replRawMode(true);
    await replSend(replStr);
    setRunning(false);
  }

  const prepSend = (snippet) => {

    // https://github.com/siliconwitchery/web-bluetooth-repl/blob/b13ade8c1aa9754e4a2ad917c2d227705c02ef7f/js/repl.js#L269
    let string = '';
    string = snippet.replaceAll('\r\n', '\r');
    string = string.replaceAll('\n', '\r');
  
    sendToMonocle(string);
  }

  const runCmd = (id) => {
    prepSend(snippet);
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
            <textarea className="body" id="white" value={snippet} onChange={(e) => setSnippet(e.target.value)}></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
