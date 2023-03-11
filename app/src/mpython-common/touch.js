export const touch = (callbackA, callbackB) => {
  const snippet = [
    `touch.callback(touch.A, ${callbackA})`,
    `touch.callback(touch.B, ${callbackB})`
  ];

  return snippet.join('\n');
}