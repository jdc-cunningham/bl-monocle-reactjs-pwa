// the dislay on monocle with default font size (50px tall) can do 26 characters per line, 8 lines eg. 208 total
// however the top line is kept free for title/article counter
// this also chunks words so it's cleaner/more comprehendible breaks

// this is super ugly but I'm just getting it done
export const chunkText = (text) => {
  const lines = [];

  let line = '';
  let lineId = 0;
  let lineIdFirst = true;
  
  const words = text.split(' ');

	for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    if (lineId === 7) {
      break;
    }
 
    if ((line.length + 1 + word.length) <= 26) {
      if (lineIdFirst) {
        line = line.length ? line + ' ' + word : word;
        lineIdFirst = false;
      } else {
        line += ` ${word}`;
      }
    } else {
      lines.push(line);

      line = word;
      lineId += 1;
      lineIdFirst = true;
    }
  };

  return lines;
}
