import { sendPythonLines } from '../utils/comms';

// this disconnects the device from bluetooth so won't use it
// main reason was to clear memory
// you could wait for the monocle to respond/update
const resetMonocle = (writing, setWriting) => {
  return new Promise((resolve, reject) => {
    sendPythonLines(
      [
        'import device',
        'gc.collect()'
      ],
      setWriting
    );

    while(writing) {
      console.log('wait');
      if (!writing) {
        console.log('resolve');
        resolve(true);
      }
    }
  });
}

const runGcCollect = (writing, setWriting) => {
  return new Promise((resolve, reject) => {
    sendPythonLines(
      [
        'import gc',
        'gc.collect()'
      ],
      setWriting
    );
  });
}

// write file to monocle persistent storage
// runs on next boot, needs main.py
// see this https://docs.micropython.org/en/latest/esp8266/tutorial/filesystem.html
// TL;DR writing a file line by line into monocle
export const writeSnippetToFile = (snippet, setWriting) => {
  const newFileLines = [
    `f = open('${snippet.filename}', 'w')`,
  ];

  snippet.content.forEach(line => {
    newFileLines.push(
      `f.write('${line}|nl|')` // dumb, issues with stripping the right )\n
    );
  });

  newFileLines.push('f.close()');

  sendPythonLines(
    newFileLines,
    setWriting
  );
}

// this takes in an array of python snippets and will
// write them to individual files on the monocle
// everytime this function runs it will clear code that is on the monocle
// this uses polling to wait for the previous write command to finish before
// attempting to write more
// export const writeToMonocle = async (snippets, setWriting, writing) => {
//   console.log('write');
//   await runGcCollect(writing, setWriting);
//   // const snippetIds = Object.keys(snippets);
  
// }