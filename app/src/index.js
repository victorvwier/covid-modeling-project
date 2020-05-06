import Model from './scripts/model';
import Chart from './scripts/chart';
import {
  INITIAL_SUSCEPTABLE,
  INITIAL_SYMPTOMATIC,
  INITAL_ASYMPTOMATIC,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import wireSlidersToHandlers from './scripts/DOM/parameters';
import AgentChart from './scripts/agentChart';


const canvas = document.getElementById('canvas');
const glCanvas = document.getElementById('glCanvas');
const gl = glCanvas.getContext("webgl");
const context = canvas.getContext('2d');
const chartCtx = document.getElementById('chart-canvas').getContext('2d');

// chartCreator();
window.onload = function () {
  if(gl === null) {
    this.alert("Please enable webGl support");
    return;
  }
  const chart = new Chart(chartCtx);
  chart.drawChart();

  const agentView = new AgentChart(gl);
  const model = new Model(
    context,
    agentView,
    canvas.width,
    canvas.height,
    INITIAL_SUSCEPTABLE,
    INITIAL_SYMPTOMATIC,
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
  //agentView.draw([1.0, 1.0, -1.0 , -1.0], 2);
  // DEBUG PURPOSES
  window.model = model;
  window.chart = chart;
};
