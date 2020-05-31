import {
  INITIAL_SUSCEPTIBLE,
  INITIAL_NONINFECTIOUS,
  INITIAL_INFECTIOUS,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import Main from './scripts/main';

/**
 * A function to initialize our program when the page is loaded.
 */
window.onload = function () {
  const glCanvas = document.getElementById('glCanvas');
  const context = glCanvas.getContext('webgl');
  const chartCtx = document.getElementById('chart-canvas').getContext('2d');
  const demographicsCtx = document
    .getElementById('demographics')
    .getContext('2d');
  const c = document.getElementById('BorderCanvas');
  const ctx = c.getContext('2d');

  if (context === null) {
    this.alert('Please enable webGl support');
    return;
  }

  const main = new Main(
    context,
    chartCtx,
    demographicsCtx,
    glCanvas.width,
    glCanvas.height,
    INITIAL_SUSCEPTIBLE,
    INITIAL_NONINFECTIOUS,
    INITIAL_INFECTIOUS,
    INITIAL_DEAD,
    INITIAL_IMMUNE
  );

  main.run(ctx);
};
