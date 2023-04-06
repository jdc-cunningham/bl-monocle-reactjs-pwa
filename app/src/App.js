import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { sendPythonLines } from './utils/comms';
import Snippets from './components/snippets/snippets';
import MonocleTerminal from './components/monocle-terminal/monocle-terminal';

function App() {
  const [connected, setConnected] = useState(false);
  const [writing, setWriting] = useState(false);
  const [monocleHistory, setMonocleHistory] = useState(['Monocle logs']);

  const [monocleInfo, setMonocleInfo] = useState({
    firmware: "0.0.0",
    storageUsed: 0,
    storage: 0,
  });

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
          'import gc',
          'print("_m_info_" + device.VERSION + "_" + str(gc.mem_free()) + "_m_info_")',
        ],
        setWriting
      )
    }

    // monocle is done processing
    if (msg.indexOf('relay: OK') !== -1) {
      setWriting(false);
    }

    const cleanMsg = msg.replace('relay: OK' , '');

    setMonocleHistory(prevState => [
      ...prevState,
      cleanMsg
    ]);

    if (cleanMsg.indexOf('_m_info_') !== -1) {
      const mInfo = cleanMsg.split('_m_info_');
      const mInfoParts = mInfo[1].split('_');

      setMonocleInfo(prevState => ({
        ...prevState,
        firmware: mInfoParts[0],
        storage: mInfoParts[1]
      }));
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="container__left">
          <Snippets
            writing={writing}
          />
          <MonocleTerminal
            connected={connected}
            writing={writing}
            sendPythonLines={sendPythonLines}
            ensureConnected={ensureConnected}
            logger={logger}
            monocleHistory={monocleHistory}
            monocleInfo={monocleInfo}
          />
        </div>
        <div className="container__right">

        </div>
      </div>
    </div>
  );
}

export default App;
