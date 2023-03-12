import { imports } from '../../mpython-common/imports';
import { battery } from '../../mpython-common/battery';
import { render } from '../../mpython-common/render';
import { borders } from '../../mpython-common/borders';
import { date } from '../../mpython-common/date';
import { controls } from './controls';
import { touch } from '../../mpython-common/touch';
import { table } from '../workout/table';

let cmdRunner;
let appScene = 'intro';

const showControls = () => {
  cmdRunner(imports());
  cmdRunner(borders(true));
  cmdRunner(controls());
  cmdRunner(touch());
  cmdRunner(render());
};

// https://stackoverflow.com/a/4929629/2710227
const getDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  return mm + '/' + dd + '/' + yyyy;
}

const showTable = () => {
  const todaysDate = getDate();
  cmdRunner(imports());
  cmdRunner(battery());
  cmdRunner(date(todaysDate));
  cmdRunner(table());
  cmdRunner(render());
};

const showActiveWorkout = () => {
  
};

export const workoutApp = {
  run: (execMonocle) => {
    cmdRunner = execMonocle;
    showControls();
  },
  leftBtnCallback: () => { // navigate
    console.log('left');
  },
  rightBtnCallback: () => { // select
    if (appScene === 'intro') {
      appScene = 'workout-table';
      showTable();
    }

    if (appScene === 'workout-table') {
      appScene = 'active-workout';
      showActiveWorkout();
    }
  }
}
