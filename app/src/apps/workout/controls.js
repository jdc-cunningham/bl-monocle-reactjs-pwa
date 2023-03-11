export const controls = () => {
  const snippet = [
    'display.text("Controls", 250, 50, 0xffffff)', // 175 is center
    'display.hline(160, 150, 50, 0xffffff)',
    'display.text("navigate", 110, 170, 0xffffff)',
    'display.hline(430, 150, 50, 0xffffff)',
    'display.text("select", 400, 170, 0xffffff)',
    'display.text("Okay", 285, 320, 0xffffff)',
    'display.hline(280, 370, 100, 0xffa500)'
  ]

  return snippet.join('\n');
}
