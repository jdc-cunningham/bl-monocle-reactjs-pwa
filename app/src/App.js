import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { sendPythonLines } from './utils/comms';
import MonocleTerminal from './components/monocle-terminal/monocle-terminal';

function App() {
  const [connected, setConnected] = useState(false);
  const [writing, setWriting] = useState(false);
  const [monocleHistory, setMonocleHistory] = useState(['Monocle logs']);

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

      // get device info
      // print to get response string
      sendPythonLines(
        [
          'import device',
          'print(device.VERSION)',
          'print(gc.mem_free())'
        ],
        setWriting
      )
    }

    // monocle is done processing
    if (msg.indexOf('relay: OK') !== -1) {
      setWriting(false);
    }

    setMonocleHistory(prevState => [
     ...prevState,
     msg.replace('relay: ', '')
    ]);
  }

  return (
    <div className="App">
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
          <MonocleTerminal
            connected={connected}
            writing={writing}
            sendPythonLines={sendPythonLines}
            ensureConnected={ensureConnected}
            logger={logger}
            monocleHistory={monocleHistory}
          />
        </div>
        <div className="container__right">

        </div>
      </div>
    </div>
  );
}

export default App;
