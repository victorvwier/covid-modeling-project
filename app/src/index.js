import Model from './scripts/model';
import {
  TYPES,
  INITIAL_SUSCEPTABLE,
  INITIAL_INFECTED,
  INITAL_ASYMPTOMATIC,
  INITIAL_IMMUNE,
  INITIAL_DEAD,
} from './scripts/CONSTANTS';
import { wireSlidersToHandlers } from './scripts/parameters';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const model = new Model(
  context,
  canvas.width,
  canvas.height,
  INITIAL_SUSCEPTABLE,
  INITIAL_INFECTED,
  INITAL_ASYMPTOMATIC,
  INITIAL_IMMUNE,
  INITIAL_DEAD
);

wireSlidersToHandlers(model);

model.populateCanvas();
model.drawPopulation();

model.setup();
model.loop();
