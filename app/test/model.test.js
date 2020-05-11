import Model from '../src/scripts/model';
import { TYPES, COLORS, PERSON_RADIUS } from '../src/scripts/CONSTANTS';
import Stats from '../src/scripts/data/stats';

function mockRandom(val) {
  const mockMath = Object.create(global.Math);
  mockMath.random = () => val;
  global.Math = mockMath;
}
const width = 100;
const height = 100;

describe('Model tests', () => {
  
  test('Changing infection radius in the model correctly propagates', () => {
    const stats = new Stats(1, 0, 0, 0, 0);
    const model = new Model(null, width, height, stats, null, null);
    model.populateCanvas();
    expect(model.population[0].radius).toBe(PERSON_RADIUS);
    model.setPersonRadius(10);
    expect(model.population[0].radius).toBe(10);
  });

  test('Test getting draw info', () => {
    const stats = new Stats(1, 0, 0, 1, 0);
    const model = new Model(null, width, height, stats, null, null);
    model.populateCanvas();
    model.setPersonRadius(10);
    const drawinfo = model.getDrawInfo();
    expect(drawinfo.positions.length).toBe(2);
    expect(drawinfo.colors.length).toBe(4);
    expect(drawinfo.count).toBe(1);
    expect(drawinfo.size).toBe(10);
  });

  test('Interact and infect Symptomatic test', () => {
    mockRandom(1); // The two people will have the same starting location
    const stats = new Stats(1, 1, 0, 0, 0);
    const model = new Model(null, width, height, stats, null, null);
    model.populateCanvas();
    expect(model.population[0].type).toBe(TYPES.SUSCEPTIBLE);
    mockRandom(1); // Infection change will be 100% symptomatic
    model.interactPopulation();
    expect(model.population[0].type).toBe(TYPES.SYMPTOMATIC);
  });

  test('Interact and infect Asymptomatic test', () => {
    mockRandom(1);
    const stats = new Stats(1, 1, 0, 0, 0);
    const model = new Model(null, width, height, stats, null, null);
    model.populateCanvas();
    expect(model.population[0].type).toBe(TYPES.SUSCEPTIBLE);
    mockRandom(0); // The infection chance will be 100% asymptomatic
    model.interactPopulation();
    expect(model.population[0].type).toBe(TYPES.ASYMPTOMATIC);
  });

  

});

describe('Pesron update tests', () => {
  test('Symptomatic person dying', () => {
    const stats = new Stats(0, 1, 0, 0, 0);
    const model = new Model(null, width, height, stats, null, null);
    model.populateCanvas();
    mockRandom(0);
    model.update(model.population[0]);
    expect(model.population[0].type).toBe(TYPES.DEAD);
    expect(model.population[0].dead).toBe(true);
  });

  test('Symptomatic person not dying', () => {
    const stats = new Stats(0, 1, 0, 0, 0);
    const model = new Model(null, width, height, stats, null, null);
    model.populateCanvas();
    mockRandom(1);
    model.update(model.population[0]);
    expect(model.population[0].type).toBe(TYPES.SYMPTOMATIC);
    expect(model.population[0].dead).toBe(false);
  });
});