import { imports } from '../../mpython-common/imports';
import { battery } from '../../mpython-common/battery';
import { render } from '../../mpython-common/render';
import { borders } from '../../mpython-common/borders';
import { date } from '../../mpython-common/date';
import { controls } from './controls';
import { touch } from '../../mpython-common/touch';
import { table } from '../workout/table';
import { activeWorkout } from './activeWorkout';
import { welcome } from './welcome';

let cmdRunner;
let appScene = 'controls';
let btnChoice = 1; // 0 left, 1 right, default is right
let curWorkout = 0;
let set = 0;

let workouts = {
  'Squats': [0, 0, 0],
  'Pushups': [0, 0, 0],
  'Situps': [0, 0, 0],
  // 'Curls': [0, 0, 0],
  // 'Lat raise': [0, 0, 0] // can't see more, need scroll or smaller font
};

const resetWorkout = () => {
  workouts = {
    'Squats': [0, 0, 0],
    'Pushups': [0, 0, 0],
    'Situps': [0, 0, 0],
    'Curls': [0, 0, 0],
    'Lat raise': [0, 0, 0]
  };
}

const importDeps = () => {
  cmdRunner(imports());
}

const splashScreen = () => {
  cmdRunner(welcome());
  cmdRunner(render());
}

const showControls = () => {
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
  cmdRunner(battery());
  cmdRunner(date(todaysDate));
  cmdRunner(table(workouts));
  cmdRunner(render());
};

const showActiveWorkout = (workout) => {
  cmdRunner(activeWorkout(workout));
  cmdRunner(render());
};

export const workoutApp = {
  run: (execMonocle) => {
    cmdRunner = execMonocle;
    importDeps();
    splashScreen();
    setTimeout(() => {
      showControls();
    }, 3000);
  },
  leftBtnCallback: () => { // navigate
    console.log('left');
  },
  rightBtnCallback: () => { // select
    if (appScene === 'controls') {
      appScene = 'workout-table';
      showTable();
    } else if (appScene === 'workout-table') { // else if due to states all firing in sequence
      appScene = 'active-workout';
      showActiveWorkout(Object.keys(workouts)[curWorkout]);
    } else if (appScene === 'active-workout') {
      workouts[Object.keys(workouts)[curWorkout]][set] = 1;

      if (curWorkout < Object.keys(workouts).length - 1) {
        curWorkout += 1;
        showActiveWorkout(Object.keys(workouts)[curWorkout]);
      } else {
        if (set < 2) {
          set += 1;
        } else {
          set = 1; // reset app
          resetWorkout();
        }

        appScene = 'workout-table';
        showTable();
      }
    }
  }
}
