import { useState, useEffect } from 'react';
import './monocle-terminal.scss';

const MonocleTerminal = (props) => {
  const {
    connected,
    writihng,
    sendPythonLines,
    ensureConnected,
    monocle_messaging,
    monocleHistory,
    monocleInfo
  } = props;
  
  return (
    <div className="MonocleTerminal">
      <div className="MonocleTerminal__top">
        <div className="MonocleTerminal__top-row">
          <h2>Monocle info</h2>
          <div className="MonocleTerminal__top-row-connection">
            <button type="button" onClick={() => ensureConnected(monocle_messaging)} disabled={connected}>{connected ? 'connected' : 'connect'}</button>
            <div className={`MonocleTerminal__top-row-connection-indicator ${connected ? 'connected' : ''}`}></div>
          </div>
        </div>
        <div className="MonocleTerminal__top-row info">
          <h3>Firmware: {monocleInfo.firmware}</h3>
          <span className="col">
            <h3>Free RAM: {Math.floor(monocleInfo.ram / 1000)} kb</h3>
            <h3>Free Storage: {Math.floor(monocleInfo.storage / 1000)} kb</h3>
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