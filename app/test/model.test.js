import Model from '../src/scripts/model';
import Stats from '../src/scripts/data/stats';
import { mockRandom } from './testHelpers';
import { mortalityStat } from '../src/scripts/util';
import {
  COLORS,
  TYPES,
  POPULATION_SPEED,
  RELOCATION_PROBABILITY,
} from '../src/scripts/CONSTANTS';
import Bounds from '../src/scripts/data/bounds';

describe('Model.js test suite', () => {
  // test('getDrawInfo should not do anything if all existing are dead', () => {
  //   const stats = new Stats(0, 0, 0, 1, 0);
  //   const bounds = new Bounds(0, 100, 0, 100);
  //   const model = new Model(1, bounds, stats, null);
  //   model.populateCanvas();
  //   const info = model.getDrawInfo();

  //   expect(info.colors).toEqual([]);
  //   expect(info.positions).toEqual([]) && expect(info.count).toBe(0);
  // });

  test('getDrawInfo should not do anything if all existing are susceptible', () => {
    const stats = new Stats(1, 0, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const model = new Model(1, bounds, stats, null);
    model.populateCanvas();
    const info = model.getDrawInfo();

    const colors = [
      parseInt(COLORS.SUSCEPTIBLE.slice(1, 3), 16) / 255.0,
      parseInt(COLORS.SUSCEPTIBLE.slice(3, 5), 16) / 255.0,
      parseInt(COLORS.SUSCEPTIBLE.slice(5, 7), 16) / 255.0,
      1,
    ];
    const positions = [model.population[0].x, model.population[0].y];

    expect(info.colors).toEqual(colors) &&
      expect(info.positions).toEqual(positions) &&
      expect(info.count).toBe(1);
  });

  test('updatePopulation should change speed if person not dead', () => {
    const stats = new Stats(1, 0, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const model = new Model(1, bounds, stats, null);
    model.populateCanvas();
    const person = model.population[0];
    const personOldX = person.x;
    const personOldY = person.y;
    const personOldSpeed = 20;
    person.maxSpeed = personOldSpeed;

    model.updatePopulation(1);
    expect(person.x).not.toBe(personOldX) &&
      expect(person.y).not.toBe(personOldY) &&
      expect(person.maxSpeed).toBe(POPULATION_SPEED);
  });

  test('updatePopulation should set person to relocating', () => {
    const stats = new Stats(0, 1, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const model = new Model(1, bounds, stats, () => {});
    const dt = 1;

    mockRandom(RELOCATION_PROBABILITY - 0.01);

    model.populateCanvas();
    const person = model.population[0];

    model.updatePopulation(dt);

    expect(person.relocating).toBe(true);
  });

  test('interactPopulation should do nothing if same person', () => {
    const stats = new Stats(1, 0, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const model = new Model(1, bounds, stats, null);
    model.populateCanvas();
    const symptomaticCountOld = model.population[0].symptomaticTime;
    model.interactPopulation();
    expect(model.population[0].symptomaticTime).toBe(symptomaticCountOld);
  });

  test('interactPopulation should increase symptomaticcount', () => {
    const stats = new Stats(1, 0, 1, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const model = new Model(1, bounds, stats, null);
    model.populateCanvas();
    // Let them be at the same location.
    model.population.forEach((x) => {
      x.x = 1;
      x.y = 1;
    });
    // Mock random to return equal to transmissionProb
    mockRandom(model.transmissionProb);

    const oldNonInfectious = model.numNonInfectious;
    const oldSusceptible = model.numSusceptible;

    model.interactPopulation(1);
    expect(model.numNonInfectious).toBe(oldNonInfectious + 1) &&
      expect(model.numSusceptible).toBe(oldSusceptible - 1);
  });

  test('update a non infectious with incubationTime !== incubationPeriod should do nothing', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 1, 0, 0, 0),
      null
    );

    model.populateCanvas();
    const nonInfectiousPerson = model.population[0];
    // Set incubation time to be -1 incubation periode so that he can go in true
    nonInfectiousPerson.incubationTime = nonInfectiousPerson.incubationPeriod;

    const oldIncubationTime = nonInfectiousPerson.incubationTime; // should be increased by 1
    const oldNonInfectious = model.numNonInfectious;
    const oldInfectious = model.numInfectious;
    const oldImmune = model.numImmune;

    // Call method
    model.update(nonInfectiousPerson, 1);

    // assert
    expect(nonInfectiousPerson.incubationTime).toBe(oldIncubationTime + 1) &&
      expect(model.numNonInfectious).toBe(oldNonInfectious) &&
      expect(model.numInfectious).toBe(oldInfectious) &&
      expect(model.numImmune).toBe(oldImmune) &&
      expect(nonInfectiousPerson.type).toBe(TYPES.NONINFECTIOUS);
  });
  // Test Suites: 2 failed, 1 passed, 3 total
  // Tests:       6 failed, 30 passed, 36 total
  test('update a non infectious should turn him infectious', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 1, 0, 0, 0),
      null
    );
    model.populateCanvas();
    const nonInfectiousPerson = model.population[0];
    // Set incubation time to be -1 incubation periode so that he can go in true
    nonInfectiousPerson.incubationTime =
      nonInfectiousPerson.incubationPeriod - 1;

    const oldIncubationTime = nonInfectiousPerson.incubationTime; // should be increased by 1
    // Mock random to be greater than nonInfectiousToImmuneProb
    mockRandom(model.nonInfectiousToImmuneProb + 0.11);
    // check p is infectious
    const oldNonInfectious = model.numNonInfectious;
    const oldInfectious = model.numInfectious;

    // Call method
    model.update(nonInfectiousPerson, 1);

    // assert
    expect(nonInfectiousPerson.incubationTime).toBe(oldIncubationTime + 1) &&
      expect(model.numNonInfectious).toBe(oldNonInfectious - 1) &&
      expect(model.numInfectious).toBe(oldInfectious + 1) &&
      expect(nonInfectiousPerson.type).toBe(TYPES.INFECTIOUS);
  });

  test('update a non infectious should turn him immune', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 1, 0, 0, 0),
      null
    );

    model.populateCanvas();
    const nonInfectiousPerson = model.population[0];
    // Set incubation time to be -1 incubation periode so that he can go in true
    nonInfectiousPerson.incubationTime =
      nonInfectiousPerson.incubationPeriod - 1;

    const oldIncubationTime = nonInfectiousPerson.incubationTime; // should be increased by 1
    // Mock random to be less than nonInfectiousToImmuneProb
    mockRandom(model.nonInfectiousToImmuneProb - 0.01);
    // check p is immune
    const oldNonInfectious = model.numNonInfectious;
    const oldImmune = model.numImmune;

    // Call method
    model.update(nonInfectiousPerson, 1);

    // assert
    expect(nonInfectiousPerson.incubationTime).toBe(oldIncubationTime + 1) &&
      expect(model.numNonInfectious).toBe(oldNonInfectious - 1) &&
      expect(model.numImmune).toBe(oldImmune + 1) &&
      expect(nonInfectiousPerson.type).toBe(TYPES.IMMUNE);
  });

  test('calling update on susceptible person should have no effect', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(1, 0, 0, 0, 0),
      null
    );

    model.populateCanvas();
    const susceptiblePerson = model.population[0];

    const oldNumSusceptible = model.numSusceptible;
    const oldNumInfectious = model.numInfectious;
    const oldNumNonInfectious = model.numNoninfectious;
    const oldNumImmune = model.numImmune;
    const oldNumDead = model.numDead;

    // Call method
    model.update(susceptiblePerson);

    expect(model.numSusceptible).toBe(oldNumSusceptible) &&
      expect(model.numInfectious).toBe(oldNumInfectious) &&
      expect(model.numNoninfectious).toBe(oldNumNonInfectious) &&
      expect(model.numImmune).toBe(oldNumImmune) &&
      expect(model.numDead).toBe(oldNumDead);
  });

  test('infectious person who is destined to immunity should become immune cause it is time', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );
    model.populateCanvas();
    const infectiousPerson = model.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = true;

    // InfectiousTime will be incremeneted by one so they'll be equal
    infectiousPerson.infectiousTime = infectiousPerson.infectiousPeriod - 1;

    const oldNumInfectious = model.numInfectious;
    const oldNumImmune = model.numImmune;

    // Call method
    model.update(infectiousPerson, 1);

    // assert
    expect(infectiousPerson.type).toBe(TYPES.IMMUNE) &&
      expect(infectiousPerson.color).toBe(COLORS.IMMUNE) &&
      expect(model.numInfectious).toBe(oldNumInfectious - 1) &&
      expect(model.numImmune).toBe(oldNumImmune + 1);
  });

  test('infectious person who is destined to immunity should not become immune cause it is not time yet', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );

    model.populateCanvas();
    const infectiousPerson = model.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = true;

    // InfectiousTime will be incremeneted by one so they'll not be equal
    infectiousPerson.infectiousTime = infectiousPerson.infectiousPeriod;

    const oldNumInfectious = model.numInfectious;
    const oldNumImmune = model.numImmune;

    // Call method
    model.update(infectiousPerson);

    // assert
    expect(infectiousPerson.type).toBe(TYPES.INFECTIOUS) &&
      expect(infectiousPerson.color).toBe(COLORS.INFECTIOUS) &&
      expect(model.numInfectious).toBe(oldNumInfectious) &&
      expect(model.numImmune).toBe(oldNumImmune);
  });

  // test('infectious person who is destined to death should become dead', () => {
  //   const model = new Model(
  //     1,
  //     new Bounds(0, 100, 0, 100),
  //     new Stats(0, 0, 1, 0, 0),
  //     null
  //   );
  //   model.populateCanvas();
  //   const infectiousPerson = model.population[0];
  //   infectiousPerson.destinyDead = true;
  //   infectiousPerson.destinyImmune = false;

  //   // InfectiousTime will be incremeneted by one so they'll be equal
  //   infectiousPerson.infectiousTime = infectiousPerson.infectiousPeriod - 1;

  //   const oldNumInfectious = model.numInfectious;
  //   const oldNumDead = model.numDead;

  //   // Call method
  //   model.update(infectiousPerson, 1);

  //   // assert
  //   expect(infectiousPerson.dead).toBe(true) &&
  //     expect(infectiousPerson.type).toBe(TYPES.DEAD) &&
  //     expect(infectiousPerson.color).toBe(COLORS.DEAD) &&
  //     expect(model.numInfectious).toBe(oldNumInfectious - 1) &&
  //     expect(model.numImmune).toBe(oldNumDead + 1);
  // });

  // test('infectious person who is destined to death should not die cause it is not time yet', () => {
  //   const model = new Model(
  //     1,
  //     new Bounds(0, 100, 0, 100),
  //     new Stats(0, 0, 1, 0, 0),
  //     null
  //   );
  //   model.populateCanvas();
  //   const infectiousPerson = model.population[0];
  //   infectiousPerson.destinyDead = true;
  //   infectiousPerson.destinyImmune = false;

  //   // InfectiousTime will be incremeneted by one so they'll not be equal
  //   infectiousPerson.infectiousTime = infectiousPerson.infectiousPeriod;

  //   const oldNumInfectious = model.numInfectious;
  //   const oldNumDead = model.numDead;

  //   // Call method
  //   model.update(infectiousPerson);

  //   // assert
  //   expect(infectiousPerson.dead).toBe(false) &&
  //     expect(infectiousPerson.type).toBe(TYPES.INFECTIOUS) &&
  //     expect(infectiousPerson.color).toBe(COLORS.INFECTIOUS) &&
  //     expect(model.numInfectious).toBe(oldNumInfectious) &&
  //     expect(model.numImmune).toBe(oldNumDead);
  // });

  test('infectious person who is neither dead nor immune should be destined to immunity', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );
    model.populateCanvas();
    const infectiousPerson = model.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = false;

    // Mock random to be greater than mortality rate of that person
    mockRandom(mortalityStat(infectiousPerson.age) + 0.01, true);

    // Call method
    model.update(infectiousPerson);

    // assert
    expect(infectiousPerson.destinyDead).toBe(false) &&
      expect(infectiousPerson.destinyImmune).toBe(true);
  });

  test('infectious person who is neither dead nor immune should be destined to death', () => {
    const model = new Model(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );
    model.populateCanvas();
    const infectiousPerson = model.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = false;

    // Mock random to be less than or equal to mortality rate of that person
    mockRandom(mortalityStat(infectiousPerson.age), true);

    // Call method
    model.update(infectiousPerson);

    // assert
    expect(infectiousPerson.destinyDead).toBe(true) &&
      expect(infectiousPerson.destinyImmune).toBe(false);
  });
});
