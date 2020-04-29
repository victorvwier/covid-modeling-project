import Model from './scripts/model';
import Chart from './scripts/chart';
import {
  INITIAL_SUSCEPTABLE,
  INITIAL_INFECTED,
  INITAL_ASYMPTOMATIC,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import { wireSlidersToHandlers } from './scripts/parameters';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const chartCtx = document.getElementById('chart-canvas').getContext('2d');

// chartCreator();
window.onload = function () {
  const chart = new Chart(chartCtx);
  chart.drawChart();

  const model = new Model(
    context,
    canvas.width,
    canvas.height,
    INITIAL_SUSCEPTABLE,
    INITIAL_INFECTED,
    INITAL_ASYMPTOMATIC,
    INITIAL_IMMUNE,
    INITIAL_DEAD,
    chart
  );

  model.populateCanvas();
  model.drawPopulation();

  model.setup();
  model.loop();

  wireSlidersToHandlers(model);
};
