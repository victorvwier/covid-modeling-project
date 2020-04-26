import Model from './scripts/model';
import { TYPES } from './scripts/CONSTANTS';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const susceptable = 99;
const infected = 1;
const removed = 0;
const asymptomatic = 0;

const model = new Model(
  context,
  canvas.width,
  canvas.height,
  susceptable,
  infected,
  removed,
  asymptomatic
);

model.populateCanvas(TYPES.SUSCEPTIBLE, susceptable);
model.populateCanvas(TYPES.INFECTED, infected);
model.drawPopulation();

console.log(model.population);
model.loop();
