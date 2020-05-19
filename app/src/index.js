import {
  INITIAL_SUSCEPTABLE,
  INITIAL_NONINFECTIOUS,
  INITAL_INFECTIOUS,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import Main from './scripts/main';

// var statistics= {susceptible:INITIAL_SUSCEPTABLE, noninfectious:INITIAL_NONINFECTIOUS, infectious:INITAL_INFECTIOUS,immune:INITIAL_IMMUNE,dead:INITIAL_DEAD};

window.onload = function () {
  const glCanvas = document.getElementById('glCanvas');
  const context = glCanvas.getContext("webgl");
  const chartCtx = document.getElementById('chart-canvas').getContext('2d');
  
  if(context === null) {
    this.alert("Please enable webGl support");
    return;
  }

  const main = new Main(
    context,
    chartCtx,
    glCanvas.width,
    glCanvas.height,
    INITIAL_SUSCEPTABLE,
    INITIAL_NONINFECTIOUS,
    INITAL_INFECTIOUS,
    INITIAL_DEAD,
    INITIAL_IMMUNE
  );

  main.run();
};

