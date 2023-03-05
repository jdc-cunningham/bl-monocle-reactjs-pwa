import { useEffect } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/web-bluetooth-repl/js/main';

function App() {
  const logger = (msg) => {
    console.log(msg)
  }

  useEffect(() => {
    ensureConnected(logger);
  }, []);

  return (
    <div className="App">

    </div>
  );
}

export default App;
