import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { sendPythonLines } from './utils/comms';
import Snippets from './components/snippets/snippets';
import MonocleTerminal from './components/monocle-terminal/monocle-terminal';
import Tabs from './components/tabs/tabs';
import Apps from './components/tab-content/apps/apps';
import { writeSnippetToFile } from './utils/persistence_writer';
import { get_storage } from './mpython-snippets/get_storage';

function App() {
  const [connected, setConnected] = useState(false);
  const [writing, setWriting] = useState(false);
  const [monocleHistory, setMonocleHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('Apps');
  const tabs = ['Apps', 'File View', 'Emulator', 'Combined Snippets'];
  const [filesToWrite, setFilesToWrite] = useState([]);
  const [filesWritten, setFilesWritten] = useState([]);

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
          'from os import statvfs',
          'import device',
          'import gc',
          get_storage(),
          'print("_m_" + device.VERSION + "_m_" + str(gc.mem_free()) + "_m_" + str(device.battery_level()) + "_m_" + get_storage() + "_m_")',
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
        ram: mInfo[2],
        battery: mInfo[3],
        storage: mInfo[4]
      }));
    }

    if (
      cleanMsg.indexOf('invalid syntax') !== -1 ||
      cleanMsg.indexOf('ValueError:') !== -1
    ) {
      alert('An error occurred, see Monocle logs');
    }
  }

  // this processes the snippets in order
  // writes as files to monocle
  // uses the writing state to make sure waiting till previous write
  // finishes before writing more
  const uploadToMonocle = (snippets) => {
    const files = [];

    Object.keys(snippets).forEach(snippetId => {
      if (snippets[snippetId].selected) {
        files.push(snippets[snippetId]);
      }
    });

    setFilesToWrite(files.reverse()); // write modules first then main
  }

  const writeFiles = () => {
    if (filesToWrite.length) {
      writeSnippetToFile(filesToWrite[0], setWriting);
    }
  }

  useEffect(() => {
    if (!writing && filesToWrite.length) {
      setFilesToWrite(prevState => ([
        ...prevState.slice(1)
      ]));
    }
  }, [writing]);

  useEffect(() => {
    // start process of writing to monocle
    if (!filesWritten.length) {
      writeFiles();
    }
  }, [filesToWrite]);

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
            uploadToMonocle={uploadToMonocle}
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
