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
import { getHnTopArticleComments } from './web-apis/hn/hn';

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
    ram: 0,
    storage: 0,
  });

  // intercept console.log specifically for disconnected message from bluetooth
  // https://stackoverflow.com/a/6455713/2710227
  (function(){

    var originallog = console.log;

    console.log = function(txt) {
      if (txt === 'disconnected') {
        setConnected(false);
      }
      originallog.apply(console, arguments);
    }
  })();

  // info such as battery, storage, ram levels
  const getDeviceInfo = () => {
    // get device info
    // print to get response string
    if (monocleInfo.storage === 0) {
      sendPythonLines(
        [
          'import os',
          'import device',
          'import gc',
          get_storage(),
          'print("_m_" + device.VERSION + "_m_" + str(gc.mem_free()) + "_m_" + str(device.battery_level()) + "_m_" + get_storage() + "_m_")',
        ],
        setWriting
      )
    } else { // already imported
      sendPythonLines(
        [
          'gc.collect()', // important to reduce ram usage building up
          'print("_m_" + device.VERSION + "_m_" + str(gc.mem_free()) + "_m_" + str(device.battery_level()) + "_m_" + get_storage() + "_m_")',
        ],
        setWriting
      )
    }
  }

  const getHnArticles = async () => {
    const articles = await getHnTopArticleComments();
    const articleCommentPairs = [];

    // process into array of title:comment pairs to send to monocle
    Object.keys(articles).forEach(articleId => {
      articleCommentPairs.push({
        title: articles[articleId].title,
        comment: articles[articleId].comment 
      })
    });

    // send to monocle
    sendPythonLines(
      [
        // `load_json_data(${JSON.stringify(articleCommentPairs)}, data_arr)`
        `load_json_data(${JSON.stringify([{title: "title", comment: "comment"}])}, data_arr)`
      ],
      setWriting
    )
  }

  // this msg str is not clean, it can include those black diamond question marks
  // tried to clean it, wouldn't work eg. remove/keep only ascii 0-127
  // in the case where it's not clean I used indexOf
  const monocle_messaging = async (msg) => {
    console.log('from monocle:', msg);

    // monocle is done processing
    if (msg.indexOf('relay: OK') !== -1) {
      setWriting(false);
    }

    const cleanMsg = msg.replace('relay: OK' , '');

    setMonocleHistory(prevState => [
      cleanMsg,
      ...prevState
    ]);

    if (cleanMsg === 'Connected') {
      setConnected(true);
      getDeviceInfo();
    }

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

    if (cleanMsg.indexOf('get_hn_articles') !== -1) {
      getHnArticles();
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
      const snippet = snippets[snippetId];
      const snippetContent = snippet.content;
      const filename = snippet.filename;

      if (snippet.selected) {
        if (snippetContent.join('\n').length > 127) {
          // use linker approach to split up into smaller chunks
          // treat main file as a map to chunks/build it up and exec

          const file_parts = [];

          let chars = ''; // snippet lines counter
          let nCount = snippetContent.length * 2; // \n

          snippetContent.forEach((line, index) => {
            if (line.length > 127) {
              alert('Line is too long', line);
              throw Error('stop write');
            }

            console.log(filename, nCount);

            if ((chars.length + line.length) < (128  - nCount)) {
              chars += line + '\n';
            } else {
              file_parts.push(chars.split('\n'));
              chars = line;
            }

            if (index === snippetContent.length - 1) {
              file_parts.push(chars.split('\n'));
            }
          });

          file_parts.forEach((fp, index) => {
            files.push({
              filename: `${filename.replace('.py', '')}_${index}.py`,
              content: fp,
            });
          });

          // imported loader file
          files.push({
            filename,
            content: (filename === 'main.py')
              ? [
                `l = ${file_parts.length}`,
                'a = ""',
                'for f in range(l):',
                `  a = "|nl|".join(open(f"${filename.replace('.py', '')}_{f}.py").readlines())`,
                'exec(a)'
              ]
              : [ // imports can be a problem unless globally available
                'def run():',
                `  l = ${file_parts.length}`,
                '  a = ""',
                '  for f in range(l):',
                `    a = "|nl|".join(open(f"${filename.replace('.py', '')}_{f}.py").readlines())`,
                '  exec(a)'
              ]
          });
        } else {
          files.push(snippets[snippetId]);
        }
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
    if (connected) {
      setTimeout(() => {
        if (!filesToWrite.length) {
          getDeviceInfo();
        }
      }, 30000);
    }
  }, [monocleInfo]);

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
            monocle_messaging={monocle_messaging}
            connected={connected}
            uploadToMonocle={uploadToMonocle}
          />
          <MonocleTerminal
            connected={connected}
            writing={writing}
            sendPythonLines={sendPythonLines}
            ensureConnected={ensureConnected}
            monocle_messaging={monocle_messaging}
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
