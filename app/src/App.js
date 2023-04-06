import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { sendPythonLines } from './utils/comms';

function App() {
  const [connected, setConnected] = useState(false);
  const [writing, setWriting] = useState(false);

  const [snippet, setSnippet] = useState([
    'import display',
    'display.text("White text line", 0, 0, 0xffffff)',
    'display.show()',
  ]);

  // this msg str is not clean, it can include those black diamond question marks
  // tried to clean it, wouldn't work eg. remove/keep only ascii 0-127
  // in the case where it's not clean I used indexOf
  const logger = async (msg) => {
    console.log('from monocle:', msg);

    if (msg === 'Connected') {
      setConnected(true);
      sendPythonLines(snippet, setWriting);
    }

    // monocle is done processing
    if (msg.indexOf('relay: OK') !== -1) {
      setWriting(false);
    }
  }

  return (
    <div className="App">
      <span className="connect">
        <p>{connected ? "connected" : "disconnected"}</p>
        <button type="button" onClick={() => ensureConnected(logger)}>Connect</button>
      </span>
      <div className="container">
        <div className="container__left">
          <div className="snippets">
            <div className="snippet">
              <span>
                <button
                  type="button"
                  className="run"
                  disabled={writing}
                  onClick={() => {}}
                >run</button>
              </span>
              <textarea
                className="body"
                id="white"
                value={snippet.join('\n')}
                onChange={(e) => setSnippet(e.target.value)}
                spellCheck={false}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="container__right">

        </div>
      </div>
    </div>
  );
}

export default App;
