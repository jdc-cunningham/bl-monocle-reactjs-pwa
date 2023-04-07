import { useState, useEffect } from 'react';
import './snippets.scss';
import PlayIcon from '../../assets/icons/uxwing_play.svg';
import UpIcon from '../../assets/icons/uxwing_chevron-up.svg';
import CloseIcon from '../../assets/icons/uxwing_close.svg';
import PlusIcon from '../../assets/icons/uxwing_plus.svg';

const Snippets = (props) => {
  const { writing } = props;

  const [snippets, setSnippets] = useState([]);
  const [newSnippetFilename, setNewSnippetFilename] = useState("");

  const saveToLocalStorage = () => {
    console.log('save');
    localStorage.setItem('monocle-snippets', JSON.stringify(snippets))
  }

  const addNewSnippet = () => {
    setSnippets(prevState => ([
      ...prevState,
      {
        id: Date.now(),
        filename: newSnippetFilename.replace('.py', '') + ".py",
        content: [],
        selected: true,
        running: false,
        collapsed: false
      }
    ]));
    setNewSnippetFilename('');
  }

  const removeSnippet = (index, filename) => {
    if (window.confirm(`Delete snippet: ${filename} ?`) === true) {
      setSnippets(prevState => ([
        ...snippets.filter(snippet => snippet.id !== index)
      ]));
    }
  }

  const updateSnippet = (id, content) => {
    const updatedSnippets = [];

    snippets.forEach(snippet => {
      if (snippet.id === id) {
        updatedSnippets.push({
          ...snippet,
          content: content,
        });
      } else {
        updatedSnippets.push(snippet)
      }
    });

    setSnippets(updatedSnippets);
  }

  useEffect(() => {
    if (snippets.length) {
      saveToLocalStorage();
    }
  }, [snippets]);

  useEffect(() => {
    const localSnippets = localStorage.getItem('monocle-snippets');
    const localSnippetsJson = localSnippets ? JSON.parse(localSnippets) : [];

    if (localSnippets && localSnippetsJson.length) {
      setSnippets(localSnippetsJson);
    } else {
      setSnippets([
        {
          id: Date.now(),
          filename: "main.py",
          content: [
            'import display',
            'display.text("main", 0, 0, 0xffffff)',
            'display.show()'
          ],
          selected: true,
          running: false,
          collapsed: false
        }
      ]);
    }
  }, []);

  const renderSnippets = () =>
    snippets.map((snippet, index) => (
      <div key={index} className={`snippet ${snippet.collapsed ? 'closed' : ''}`}>
        <div className="snippet__top">
          <span>
            <input type="checkbox" onChange={(e) => {}} defaultChecked={snippet.selected}/>
            {snippet.filename}
          </span>
          <span>
            {
              index > 0 &&
              <button type="button" disabled={writing} title="delete snippet" onClick={() => removeSnippet(snippet.id, snippet.filename)}>
                <img src={CloseIcon} className="snippet_run-icon" alt="delete icon"/>
              </button>
            }
            <button type="button" disabled={writing} title="run snippet">
              <img src={PlayIcon} className="snippet_run-icon" alt="play icon"/>
            </button>
            <button type="button" title={snippet.collapsed ? 'open' : 'close'}>
              <img src={UpIcon} alt="expand collapse icon" className={`snippet_expand-collapse ${snippet.collapsed ? 'collapsed' : ''}`}/>
            </button>
          </span>
        </div>
        <div className="snippet__body">
          <textarea onChange={(e) => {updateSnippet(snippet.id, e.target.value.split('\n'))}} value={snippet.content.join('\n')}/>
        </div>
      </div>
    ));

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
          <button type="button" className="Snippets__run-selected" title="run selected snippets">
            Run selected
            <img src={PlayIcon} className="snippet_run-icon" alt="play icon"/>
          </button>
        </span>
      </span>
      {snippets.length ? renderSnippets() : 'Checking for local snippets...'}
    </div>
  );
}

export default Snippets;