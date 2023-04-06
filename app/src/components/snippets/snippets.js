import { useState, useEffect } from 'react';
import './snippets.scss';
import PlayIcon from '../../assets/icons/uxwing_play.svg';
import UpIcon from '../../assets/icons/uxwing_chevron-up.svg';

const Snippets = (props) => {
  const { writing } = props;

  const [snippets, setSnippets] = useState([
    {
      filename: "main.py",
      content: [
        'import display',
        'display.text("main", 0, 0, 0xffffff)',
        'display.show()'
      ],
      selected: false,
      running: false,
      collapsed: false
    }
  ]);

  const renderSnippets = () =>
    snippets.map(snippet => (
      <div className={`snippet ${snippet.collapsed ? 'closed' : ''}`}>
        <div className="snippet__top">
          <span>
            <input type="checkbox" selected={snippet.selected}/>
            {snippet.filename}
          </span>
          <span>
            <button type="button" disabled={writing} title="run snippet">
              <img src={PlayIcon} className="snippet_run-icon" alt="play icon"/>
            </button>
            <button type="button" title={snippet.collapsed ? 'open' : 'close'}>
              <img src={UpIcon} alt="expand collapse icon" className={`snippet_expand-collapse ${snippet.collapsed ? 'collapsed' : ''}`}/>
            </button>
          </span>
        </div>
        <div className="snippet__body">
          <textarea onChange={(e) => {}}>{snippet.content.join('\n')}</textarea>
        </div>
      </div>
    ));

  return (
    <div className="Snippets">
      <h2>Snippets</h2>
      {renderSnippets()}
    </div>
  );
}

export default Snippets;