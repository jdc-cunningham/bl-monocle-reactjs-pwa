import { imports } from '../../mpython-common/imports';
import { battery } from '../../mpython-common/battery';
import { render } from '../../mpython-common/render';
import { borders } from '../../mpython-common/borders';
import { controls } from './controls';
import { touch } from '../../mpython-common/touch';

let cmdRunner;
let appMode = '';

const leftBtnCallback = () => {

}

const rightBtnCallback = () => {
  
}

const showControls = () => {
  cmdRunner(imports());
  cmdRunner(borders(true));
  cmdRunner(controls());
  // cmdRunner(touch(leftBtnCallback, rightBtnCallback));
  cmdRunner(render());
};

const showSplash = () => {

};

const showTable = () => {

};

const showActiveWorkout = () => {

};

export const workoutApp = {
  run: (execMonocle) => {
    cmdRunner = execMonocle;
    showControls();
  }
}
