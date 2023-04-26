import { replRawMode, replSend } from '../bluetooth/js/repl';

// send to monocle display
const writeToMonocle = async (replStr, setWriting) => {
  setWriting(true);
  await replRawMode(true);
  await replSend(replStr);
}

const filterPayload = (snippet, setWriting) => {
  // https://github.com/siliconwitchery/web-bluetooth-repl/blob/b13ade8c1aa9754e4a2ad917c2d227705c02ef7f/js/repl.js#L269
  let string = snippet;
  let fileWriteOp = snippet.indexOf('f = open') !== -1;

  string = snippet.replaceAll('\r\n', '\r');
  string = string.replaceAll('\n', '\r');
  
  if (fileWriteOp) {
    string = string.replaceAll('|nl|', '\\n');
  }

  // if(string.indexOf('device.VERSION') === -1) {
  //   console.log(string);
  //   setWriting(true);
  //   setTimeout(() => {
  //     setWriting(false);
  //   }, 1000);
  // } else {
  //   writeToMonocle(string, setWriting);
  // }

  // console.log(string);

  writeToMonocle(string, setWriting);
}

export const sendPythonLines = (snippet, setWriting) => {
  filterPayload(snippet.join('\n'), setWriting);
}
