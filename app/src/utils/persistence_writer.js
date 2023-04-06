import { sendPythonLines } from '../utils/comms';

const resetMonocle = () => {
  return new Promise((resolve, reject) => {

  });
}

// this takes in an array of python snippets
// it should be in top-bottom order with regard to imports
// everytime this function runs it will clear code that is on the monocle
const writeToMonocle = async (files) => {
  
}