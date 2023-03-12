export const activeWorkout = (workoutName) => {
  const snippet = [
    `display.text("Doing ${workoutName}", 50, 50, 0xffffff)`,
    'display.text("Cancel", 50, 150, 0xffffff)',
    'display.text("Done", 350, 150, 0xffffff)',
    'display.line(350, 210, 450, 210, 0xffa500)'
  ];

  return snippet.join('\n');
};