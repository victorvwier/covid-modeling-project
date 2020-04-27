import Model from './scripts/model';
import { TYPES } from './scripts/CONSTANTS';
import { sliderValues } from './scripts/parameters';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const susceptable = 99;
const infected = 3;
const asymptomatic = 0;
const immune = 0;
const dead = 0;

const model = new Model(
  context,
  canvas.width,
  canvas.height,
  susceptable,
  infected,
  asymptomatic,
  immune,
  dead
);

sliderValues(model);

model.populateCanvas(TYPES.SUSCEPTIBLE, susceptable);
model.populateCanvas(TYPES.INFECTED, infected);
model.populateCanvas(TYPES.DEAD, dead);
model.populateCanvas(TYPES.IMMUNE, immune);
model.populateCanvas(TYPES.ASYMPTOMATIC, asymptomatic);
model.drawPopulation();

console.log(model.population);

model.setup();
model.loop();
