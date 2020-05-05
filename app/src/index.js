import {
  INITIAL_SUSCEPTABLE,
  INITIAL_SYMPTOMATIC,
  INITAL_ASYMPTOMATIC,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import Main from './scripts/main';

window.onload = function () {
  const canvas = document.getElementById('canvas');
  const modelChart = canvas.getContext('2d');
  const chartCtx = document.getElementById('chart-canvas').getContext('2d');

  const main = new Main(
    modelChart,
    chartCtx,
    canvas.width,
    canvas.height,
    INITIAL_SUSCEPTABLE,
    INITIAL_SYMPTOMATIC,
    INITAL_ASYMPTOMATIC,
    INITIAL_DEAD,
    INITIAL_IMMUNE
  );
  main.run();
};
