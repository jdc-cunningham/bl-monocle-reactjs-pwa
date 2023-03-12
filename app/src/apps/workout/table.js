export const table = (workoutInfo) => {
  const workoutRows = () => {
    const rows = [];

    let yPos = 140;

    Object.keys(workoutInfo).forEach(workout => {
      rows.push(
        `display.text("${workout}", 5, ${yPos}, 0xffffff)` // can condense into one push
      );

      let xPos = 220;

      workoutInfo[workout].forEach((set, index) => {
        const setDone = set > 0;
        rows.push(`display.text("${setDone ? 'x' : ' '}", ${xPos}, ${yPos}, ${setDone ? '0xffa500' : '0xffffff'})`);
        
        if (index === 1) {
          xPos = 360;
        } else {
          xPos = 510;
        }
      });

      yPos += 60;
    });

    return rows;
  }

  console.log(workoutRows().length);
  console.log(workoutRows());

  const snippet = [
    'display.text("Name", 5, 75, 0xffffff)',
    'display.text("Set 1", 220, 75, 0xffffff)',
    'display.text("Set 2", 360, 75, 0xffffff)',
    'display.text("Set 3", 510, 75, 0xffffff)',
    'display.line(0, 130, 640, 130, 0xffffff)',
    'display.line(208, 75, 208, 400, 0xffffff)',
    ...workoutRows(),
    `display.text(
      "${(workoutInfo['Situps'][0] > 0)
        ? 'Next set'
        : 'Start set'
      }", 250, 340, 0xffffff
    )`,
    'display.line(250, 390, 420, 390, 0xffa500)'
  ];

  return snippet.join('\n');
}