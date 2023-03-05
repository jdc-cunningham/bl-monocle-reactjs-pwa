import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { replRawMode, replSend } from './bluetooth/js/repl';
import { getHnTopArticleComments} from './hacker-news/hn';

function App() {
  const [connected, setConnected] = useState(false);

  const sampleCmds = [
    'import display;',
    'display.text("yo", 0, 0, 0xffffff);',
    'display.show();'
  ];

  const logger = async (msg) => {
    if (msg === 'Connected') {
      setConnected(true);
    }

    await replRawMode(true);
    await replSend(sampleCmds.join(''));

    console.log(msg)
  }

  const getHn = async () => {
    await getHnTopArticleComments();
  }

  useEffect(() => {
    getHn()
  }, []);

  return (
    <div className="App">
      <p>{connected ? "connected" : "disconnected"}</p>
      <button type="button" onClick={() => ensureConnected(logger)}>Connect</button>
    </div>
  );
}

export default App;
