import { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import { replRawMode, replSend } from './bluetooth/js/repl';
import { getHnTopArticleComments} from './hacker-news/hn';

function App() {
  const [connected, setConnected] = useState(false);

  const getHn = async () => {
    await getHnTopArticleComments();
  }

  const displayHnArticleComment = (articleComments) => {
    return new Promise(resolve => {
      const articleIds = Object.keys(articleComments);
      
      if (articleIds.length) {
        const body = articleComments[articleIds[0]];

        setTimeout(async () => {
          let replCmd = 'import display;'
  
          replCmd += `display.text(${body.title.substring(0, 26)}, 0, 0, 0xffffff`;;
          replCmd += `display.text(${body.comment.substring(0, 26)}, 0, 50, 0xffffff});`;
          replCmd += 'display.show()'
  
          await replSend(replCmd);
          delete articleIds[articleIds[0]];
        }, 5000);
      } else {
        resolve(""); // done
      }
    });
  }

  // send to monocle display
  const displayHnArticleComments = async (hnArticleComments) => {
    await replRawMode(true);
    displayHnArticleComment(hnArticleComments);
  }

  const logger = async (msg) => {
    if (msg === 'Connected') {
      setConnected(true);
    }

    const hnArticleComments = getHn();
    displayHnArticleComments(hnArticleComments);
  }

  return (
    <div className="App">
      <p>{connected ? "connected" : "disconnected"}</p>
      <button type="button" onClick={() => ensureConnected(logger)}>Connect</button>
    </div>
  );
}

export default App;
