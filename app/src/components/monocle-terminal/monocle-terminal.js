import { useState, useEffect } from 'react';
import './monocle-terminal.scss';

const MonocleTerminal = (props) => {
  const {
    connected,
    writihng,
    sendPythonLines,
    ensureConnected,
    logger,
    monocleHistory,
    monocleInfo
  } = props;
  
  return (
    <div className="MonocleTerminal">
      <div className="MonocleTerminal__top">
        <div className="MonocleTerminal__top-row">
          <h2>Monocle info</h2>
          <div className="MonocleTerminal__top-row-connection">
            <button type="button" onClick={() => ensureConnected(logger)} disabled={connected}>{connected ? 'connected' : 'connect'}</button>
            <div className={`MonocleTerminal__top-row-connection-indicator ${connected ? 'connected' : ''}`}></div>
          </div>
        </div>
        <div className="MonocleTerminal__top-row info">
          <h3>Firmware version: {monocleInfo.firmware}</h3>
          <span className="col">
            <h3>Storage: {Math.floor(monocleInfo.storageUsed/1000)}/{Math.floor(monocleInfo.storage / 1000)} kb</h3>
            <h3>Batt: {monocleInfo.battery || 100}%</h3>
          </span>
        </div>
      </div>
      <div className="MonocleTerminal__body">
        <textarea readOnly={true} value={monocleHistory.join('\n')} onChange={(e) => {console.log(e.target.value)}} placeholder="Monocle logs"/>
      </div>
    </div>
  );
}

export default MonocleTerminal;