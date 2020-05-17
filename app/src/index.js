import {
  INITIAL_SUSCEPTABLE,
  INITIAL_NONINFECTIOUS,
  INITAL_INFECTIOUS,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import wireSlidersToHandlers from './scripts/DOM/parameters';
import Main from './scripts/main';

//var statistics= {susceptible:INITIAL_SUSCEPTABLE, noninfectious:INITIAL_NONINFECTIOUS, infectious:INITAL_INFECTIOUS,immune:INITIAL_IMMUNE,dead:INITIAL_DEAD};

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

export function updateTheStatistics(numSusceptible,numNonInfectious,numInfectious,numImmune,numDead){
  document.getElementById("s1").innerHTML =numSusceptible;
  document.getElementById("s2").innerHTML =numNonInfectious;
  document.getElementById("s3").innerHTML =numInfectious;
  document.getElementById("s4").innerHTML =numImmune;
  document.getElementById("s5").innerHTML =numDead;
}
