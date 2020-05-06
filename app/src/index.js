import {
  INITIAL_SUSCEPTABLE,
  INITIAL_SYMPTOMATIC,
  INITAL_ASYMPTOMATIC,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import wireSlidersToHandlers from './scripts/DOM/parameters';
import AgentChart from './scripts/agentChart';
import Main from './scripts/main';

window.onload = function () {
  const glCanvas = document.getElementById('glCanvas');
  const gl = glCanvas.getContext("webgl");
  const chartCtx = document.getElementById('chart-canvas').getContext('2d');
  
  if(gl === null) {
    this.alert("Please enable webGl support");
    return;
  }

  const agentView = new AgentChart(gl);
  
  const main = new Main(
    agentView,
    chartCtx,
    glCanvas.width,
    glCanvas.height,
    INITIAL_SUSCEPTABLE,
    INITIAL_SYMPTOMATIC,
    INITAL_ASYMPTOMATIC,
    INITIAL_DEAD,
    INITIAL_IMMUNE
  );

  main.run();
};
