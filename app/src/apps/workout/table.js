export const table = (date, workoutInfo) => {
  const snippet = [
    'display.text("Name", 5, 75, 0xffffff)',
    'display.text("Set 1", 220, 75, 0xffffff)',
    'display.text("Set 2", 360, 75, 0xffffff)',
    'display.text("Set 3", 510, 75, 0xffffff)',
    'display.line(0, 130, 640, 130, 0xffffff)',
    'display.line(212, 75, 212, 400, 0xffffff)'
  ];

  return snippet.join('\n');
}