export const touch = (callbackA = '', callbackB = '') => {
  const snippet = [
    'def callbackA(arg):',
    '  print("trigger b")',
    'def callbackB(arg):',
    '  print("trigger a")',
    `touch.callback(touch.A, callbackA)`,
    `touch.callback(touch.B, callbackB)`
  ];

  return snippet.join('\n');
}