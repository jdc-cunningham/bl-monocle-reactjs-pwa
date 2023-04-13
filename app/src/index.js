import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/css-reset.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // https://stackoverflow.com/questions/49055172/react-component-mounting-twice
  <App /> /* strict mode removed to avoid double mounting */
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
