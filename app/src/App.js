import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { sendPythonLines } from './utils/comms';
import Snippets from './components/snippets/snippets';
import MonocleTerminal from './components/monocle-terminal/monocle-terminal';
import Tabs from './components/tabs/tabs';
import Apps from './components/tab-content/apps/apps';

function App() {
  const [connected, setConnected] = useState(false);
  const [writing, setWriting] = useState(false);
  const [monocleHistory, setMonocleHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('Apps');
  const tabs = ['Apps', 'File View', 'Emulator', 'Combined Snippets'];

  const [monocleInfo, setMonocleInfo] = useState({
    firmware: "0.0.0",
    storageUsed: 0,
    storage: 0,
  });

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
          'print("_m_" + device.VERSION + "_m_" + str(gc.mem_free()) + "_m_" + str(device.battery_level()) + "_m_")',
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
      cleanMsg,
      ...prevState
    ]);

    if (cleanMsg.indexOf('_m_') !== -1) {
      const mInfo = cleanMsg.split('_m_');

      setMonocleInfo(prevState => ({
        ...prevState,
        firmware: mInfo[1],
        storage: mInfo[2],
        battery: mInfo[3]
      }));
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="container__left">
          <Snippets
            writing={writing}
            setWriting={setWriting}
            ensureConnected={ensureConnected}
            logger={logger}
            connected={connected}
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
          <Tabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab}/>
          {activeTab === 'Apps' && <Apps/>}
        </div>
      </div>
    </div>
  );
}

export default App;
