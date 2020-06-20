/* eslint-disable import/first */

import presetManager from './scripts/presetsManager';
import adjustUi from './scripts/DOM/adjustUi';
import Main from './scripts/main';
import {
  createPresetsDropDown,
  setAttractionToCenter,
  setNumCommunities,
  setRepulsionForce,
} from './scripts/DOM/domValues';
import { createSliders } from './scripts/DOM/timelineDOM';

const {
  INITIAL_SUSCEPTIBLE,
  INITIAL_NONINFECTIOUS,
  INITIAL_INFECTIOUS,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
  ATTRACTION_FORCE,
  NUM_COMMUNITIES,
  REPULSION_FORCE,
} = presetManager.loadPreset();

/**
 * A function to set all relevant data from the preset into the DOM.
 */
function setPresetData() {
  setAttractionToCenter(ATTRACTION_FORCE);
  setNumCommunities(NUM_COMMUNITIES);
  setRepulsionForce(REPULSION_FORCE);
}

/**
 * A function to initialize our program when the page is loaded.
 */
window.onload = function () {
  // const seedrandom = require('seedrandom')
  // const rand = seedrandom('hello', { global: true });
  createPresetsDropDown();
  setPresetData();
  const glCanvas = document.getElementById('glCanvas');
  const context = glCanvas.getContext('webgl');
  const chartCtx = document.getElementById('chart-canvas').getContext('2d');
  const timelineCanvas = document.getElementById('timeline-element');
  const demographicsCtx = document
    .getElementById('demographics')
    .getContext('2d');
  const borderCtx = document.getElementById('BorderCanvas').getContext('2d');
  const { height } = borderCtx.canvas.getBoundingClientRect();
  borderCtx.transform(1, 0, 0, -1, 0, height);

  if (context === null) {
    this.alert('Please enable webGl support');
    return;
  }
  const main = new Main(
    context,
    chartCtx,
    timelineCanvas,
    borderCtx,
    demographicsCtx,
    glCanvas.width,
    glCanvas.height,
    INITIAL_SUSCEPTIBLE,
    INITIAL_NONINFECTIOUS,
    INITIAL_INFECTIOUS,
    INITIAL_DEAD,
    INITIAL_IMMUNE
  );
  createSliders();
  main.run();
  setTimeout(() => adjustUi.makeLeftAndRightPanelSameHeight(), 500);
};
