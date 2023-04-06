import { useState, useEffect } from 'react';
import './monocle-terminal.scss';

const MonocleTerminal = (props) => {
  const {
    connected,
    writihng,
    sendPythonLines,
    ensureConnected,
    logger,
    monocleHistory
  } = props;
  
  const [monocleInfo, setMonocleInfo] = useState({
    firmware: "0.0.0",
    storageUsed: 0,
    storage: 0,
  });

  return (
    <div className="MonocleTerminal">
      <div className="MonocleTerminal__top">
        <div className="MonocleTerminal__top-row">
          <h2>Monocle</h2>
          <div className="MonocleTerminal__top-row-connection">
            <button type="button" onClick={() => ensureConnected(logger)}>{connected ? 'connected' : 'connect'}</button>
            <div className={`MonocleTerminal__top-row-connection-indicator ${connected ? 'connected' : ''}`}></div>
          </div>
        </div>
        <div className="MonocleTerminal__top-row info">
          <h3>Firmware version: {monocleInfo.firmware}</h3>
          <h3>Used storage: {monocleInfo.storageUsed}/{monocleInfo.storage}</h3>
        </div>
      </div>
      <div className="MonocleTerminal__body">
        <textarea readOnly={true} value={monocleHistory.join('\n')} onChange={(e) => {console.log(e.target.value)}}/>
      </div>
    </div>
  );
}

export default MonocleTerminal;