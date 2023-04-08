import { useState, useEffect } from 'react';
import './snippets.scss';
import PlayIcon from '../../assets/icons/uxwing_play.svg';
import UpIcon from '../../assets/icons/uxwing_chevron-up.svg';
import CloseIcon from '../../assets/icons/uxwing_close.svg';
import PlusIcon from '../../assets/icons/uxwing_plus.svg';
import { sendPythonLines } from '../../utils/comms';

const Snippets = (props) => {
  const { writing, setWriting, ensureConnected, logger, connected, uploadToMonocle } = props;

  const [snippets, setSnippets] = useState({});
  const [newSnippetFilename, setNewSnippetFilename] = useState("");
  const [postConnectRun, setPostConnectRun] = useState({});

  const saveToLocalStorage = () => {
    console.log('save');
    localStorage.setItem('monocle-snippets', JSON.stringify(snippets))
  }

  const addNewSnippet = () => {
    setSnippets(prevState => ({
      ...prevState,
      [Date.now()]: {
        filename: newSnippetFilename.replace('.py', '') + ".py",
        content: [],
        selected: true,
        running: false,
        collapsed: false
      }
    }));
    setNewSnippetFilename('');
  }

  const removeSnippet = (snippetId, filename) => {
    if (window.confirm(`Delete snippet: ${filename} ?`) === true) {
      setSnippets(prevState => ({
        ...snippets,
        [snippetId]: undefined,
      }));
    }
  }

  const updateSnippet = (snippetId, content) => {
    setSnippets(prevState => ({
      ...prevState,
      [snippetId]: {
        ...prevState[snippetId],
        content: content
      }
    }));
  }

  const runOnMonocle = (snippetId) => {
    if (!connected) {
      ensureConnected(logger);
      setPostConnectRun({
        content: snippets[snippetId].content,
        setWriting,
      })
    } else {
      sendPythonLines(
        snippets[snippetId].content,
        setWriting
      );
    }
  }

  const toggleSnippet = (snippetId) => {
    setSnippets(prevState => ({
      ...prevState,
      [snippetId]: {
        ...prevState[snippetId],
        collapsed: !prevState[snippetId].collapsed
      }
    }));
  }

  const toggleCheck = (snippetId) => {
    setSnippets(prevState => ({
      ...prevState,
      [snippetId]: {
        ...prevState[snippetId],
        selected: !prevState[snippetId].selected
      }
    }));
  }

  useEffect(() => {
    if (connected && Object.keys(postConnectRun).length) {
      sendPythonLines(
        postConnectRun.content,
        postConnectRun.setWriting
      );
      setPostConnectRun({});
    }
  }, [connected]);

  useEffect(() => {
    if (Object.keys(snippets).length) {
      saveToLocalStorage();
    }
  }, [snippets]);

  useEffect(() => {
    const localSnippets = localStorage.getItem('monocle-snippets');
    const localSnippetsJson = localSnippets ? JSON.parse(localSnippets) : {};

    if (localSnippets && Object.keys(localSnippetsJson).length) {
      setSnippets(localSnippetsJson);
    } else {
      setSnippets({
        [Date.now()]: {
          filename: "main.py",
          content: [
            'import display',
            'display.text("main", 0, 0, 0xffffff)',
            'display.show()'
          ],
          selected: true,
          running: false,
          collapsed: false
        },
        [Date.now() + 5]: { // too fast uses same
          filename: "list-files.py",
          content: [
            'import os',
            'path = "/"',
            'print(os.listdir(path))'
          ],
          selected: true,
          running: false,
          collapsed: false
        }
      });
    }
  }, []);

  const renderSnippets = () =>
    Object.keys(snippets).map((snippetId, index) => {
      const snippet = snippets[snippetId];

      if (!snippet?.filename) { // deleted/undefined
        return false;
      }

      return (
        <div key={snippetId} className={`snippet ${snippet.collapsed ? 'closed' : ''}`}>
          <div className="snippet__top">
            <span>
              <input type="checkbox" onChange={(e) => toggleCheck(snippetId)} defaultChecked={snippet.selected}/>
              {snippet.filename}
            </span>
            <span>
              {
                index > 0 &&
                <button type="button" disabled={writing} title="delete snippet" onClick={() => removeSnippet(snippetId, snippet.filename)}>
                  <img src={CloseIcon} className="snippet_run-icon" alt="delete icon"/>
                </button>
              }
              <button type="button" disabled={writing} title="run snippet on monocle" onClick={() => runOnMonocle(snippetId)}>
                <img src={PlayIcon} className="snippet_run-icon" alt="play icon"/>
              </button>
              <button className="expand-collapse" type="button" title={snippet.collapsed ? 'open' : 'close'} onClick={() => toggleSnippet(snippetId)}>
                <img src={UpIcon} alt="expand collapse icon" className={`snippet_expand-collapse ${snippet.collapsed ? 'collapsed' : ''}`}/>
              </button>
            </span>
          </div>
          <div className="snippet__body">
            <textarea onChange={(e) => {updateSnippet(snippetId, e.target.value.split('\n'))}} value={snippet.content.join('\n')}/>
          </div>
        </div>
      );
    });

  return (
    <div className="Snippets">
      <h2>Snippets</h2>
      <span className="Snippets__new-snippet-span">
        <span>
          <input type="text" className="Snippets__new-snippet-filename" value={newSnippetFilename} placeholder="filename" onChange={(e) => setNewSnippetFilename(e.target.value)}/>
          <button className="Snippets__new-snippet-btn" type="button" title="new snippet" onClick={() => addNewSnippet()}>
            <img className="Snippets__new-snippet-btn-icon" src={PlusIcon} alt="add snippet icon"/>
            Add
          </button>
        </span>
        <span>
          <button type="button" className="Snippets__run-selected" title="save to monocle" onClick={() => uploadToMonocle(snippets)} disabled={writing}>
            Upload selected
              <img src={PlayIcon} className="snippet_run-icon" alt="play icon"/>
          </button>
        </span>
      </span>
      {Object.keys(snippets).length ? renderSnippets() : 'Checking for local snippets...'}
    </div>
  );
}

export default Snippets;