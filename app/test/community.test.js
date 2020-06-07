import Community from '../src/scripts/community';
import Stats from '../src/scripts/data/stats';
import Person from '../src/scripts/person';
import { mockRandom } from './testHelpers';
import presetsManager from '../src/scripts/presetsManager';
import Bounds from '../src/scripts/data/bounds';
import { COLORS, TYPES } from '../src/scripts/CONSTANTS';

const {
  POPULATION_SPEED,
  RELOCATION_PROBABILITY,
} = presetsManager.loadPreset();

describe('community.js test suite', () => {
  test('getDrawInfo should not do anything if all existing are susceptible', () => {
    const stats = new Stats(1, 0, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const community = new Community(1, bounds, stats, null);

    community.populateCanvas();
    const info = community.getDrawInfo();

    const colors = [
      parseInt(COLORS.SUSCEPTIBLE.slice(1, 3), 16) / 255.0,
      parseInt(COLORS.SUSCEPTIBLE.slice(3, 5), 16) / 255.0,
      parseInt(COLORS.SUSCEPTIBLE.slice(5, 7), 16) / 255.0,
      1,
    ];
    const positions = [community.population[0].x, community.population[0].y];

    expect(info.colors).toEqual(colors) &&
      expect(info.positions).toEqual(positions) &&
      expect(info.count).toBe(1);
  });

  test('updatePopulation should change speed if person not dead', () => {
    const stats = new Stats(1, 0, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const community = new Community(1, bounds, stats, null);

    community.populateCanvas();
    const person = community.population[0];
    const personOldX = person.x;
    const personOldY = person.y;
    const personOldSpeed = 20;
    person.maxSpeed = personOldSpeed;

    community.updatePopulation(1);
    expect(person.x).not.toBe(personOldX) &&
      expect(person.y).not.toBe(personOldY) &&
      expect(person.maxSpeed).toBe(POPULATION_SPEED);
  });

  test('updatePopulation should set person to relocating', () => {
    const stats = new Stats(0, 1, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const registerRelocation = jest.fn(() => {});
    const community = new Community(1, bounds, stats, registerRelocation);

    const dt = 1;

    mockRandom(RELOCATION_PROBABILITY - 0.01);

    community.populateCanvas();
    const person = community.population[0];

    community.updatePopulation(dt);

    expect(person.relocating).toBe(true);
  });

  test('interactPopulation should do nothing if same person', () => {
    const stats = new Stats(1, 0, 0, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const community = new Community(1, bounds, stats, null);

    community.populateCanvas();
    const symptomaticCountOld = community.population[0].symptomaticTime;
    community.interactPopulation();
    expect(community.population[0].symptomaticTime).toBe(symptomaticCountOld);
  });

  test('interactPopulation should increase symptomaticcount', () => {
    const stats = new Stats(1, 0, 1, 0, 0);
    const bounds = new Bounds(0, 100, 0, 100);
    const community = new Community(1, bounds, stats, null);

    community.populateCanvas();
    // Let them be at the same location.
    community.population.forEach((x) => {
      x.x = 1;
      x.y = 1;
    });
    // Mock random to return equal to transmissionProb
    mockRandom(community.transmissionProb);

    const oldNonInfectious = community.numNonInfectious;
    const oldSusceptible = community.numSusceptible;

    community.interactPopulation(1);
    expect(community.numNonInfectious).toBe(oldNonInfectious + 1) &&
      expect(community.numSusceptible).toBe(oldSusceptible - 1);
  });

  test('update a non infectious with incubationTime !== incubationPeriod should do nothing', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 1, 0, 0, 0),
      null
    );

    community.populateCanvas();
    const nonInfectiousPerson = community.population[0];
    // Set incubation time to be -1 incubation periode so that he can go in true
    nonInfectiousPerson.incubationTime = nonInfectiousPerson.incubationPeriod;

    const oldIncubationTime = nonInfectiousPerson.incubationTime; // should be increased by 1
    const oldNonInfectious = community.numNonInfectious;
    const oldInfectious = community.numInfectious;
    const oldImmune = community.numImmune;

    // Call method
    community.update(nonInfectiousPerson, 1);

    // assert
    expect(nonInfectiousPerson.incubationTime).toBe(oldIncubationTime + 1) &&
      expect(community.numNonInfectious).toBe(oldNonInfectious) &&
      expect(community.numInfectious).toBe(oldInfectious) &&
      expect(community.numImmune).toBe(oldImmune) &&
      expect(nonInfectiousPerson.type).toBe(TYPES.NONINFECTIOUS);
  });
  // Test Suites: 2 failed, 1 passed, 3 total
  // Tests:       6 failed, 30 passed, 36 total
  test('update a non infectious should turn him infectious', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 1, 0, 0, 0),
      null
    );
    community.populateCanvas();
    const nonInfectiousPerson = community.population[0];
    // Set incubation time to be -1 incubation periode so that he can go in true
    nonInfectiousPerson.incubationTime =
      nonInfectiousPerson.incubationPeriod - 1;

    const oldIncubationTime = nonInfectiousPerson.incubationTime; // should be increased by 1
    // Mock random to be greater than nonInfectiousToImmuneProb
    mockRandom(community.nonInfectiousToImmuneProb + 0.11);
    // check p is infectious
    const oldNonInfectious = community.numNonInfectious;
    const oldInfectious = community.numInfectious;

    // Call method
    community.update(nonInfectiousPerson, 1);

    // assert
    expect(nonInfectiousPerson.incubationTime).toBe(oldIncubationTime + 1) &&
      expect(community.numNonInfectious).toBe(oldNonInfectious - 1) &&
      expect(community.numInfectious).toBe(oldInfectious + 1) &&
      expect(nonInfectiousPerson.type).toBe(TYPES.INFECTIOUS);
  });

  test('update a non infectious should turn him immune', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 1, 0, 0, 0),
      null
    );

    community.populateCanvas();
    const nonInfectiousPerson = community.population[0];
    // Set incubation time to be -1 incubation periode so that he can go in true
    nonInfectiousPerson.incubationTime =
      nonInfectiousPerson.incubationPeriod - 1;

    const oldIncubationTime = nonInfectiousPerson.incubationTime; // should be increased by 1
    // Mock random to be less than nonInfectiousToImmuneProb
    mockRandom(community.nonInfectiousToImmuneProb - 0.01);
    // check p is immune
    const oldNonInfectious = community.numNonInfectious;
    const oldImmune = community.numImmune;

    // Call method
    community.update(nonInfectiousPerson, 1);

    // assert
    expect(nonInfectiousPerson.incubationTime).toBe(oldIncubationTime + 1) &&
      expect(community.numNonInfectious).toBe(oldNonInfectious - 1) &&
      expect(community.numImmune).toBe(oldImmune + 1) &&
      expect(nonInfectiousPerson.type).toBe(TYPES.IMMUNE);
  });

  test('calling update on susceptible person should have no effect', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(1, 0, 0, 0, 0),
      null
    );

    community.populateCanvas();
    const susceptiblePerson = community.population[0];

    const oldNumSusceptible = community.numSusceptible;
    const oldNumInfectious = community.numInfectious;
    const oldNumNonInfectious = community.numNoninfectious;
    const oldNumImmune = community.numImmune;
    const oldNumDead = community.numDead;

    // Call method
    community.update(susceptiblePerson);

    expect(community.numSusceptible).toBe(oldNumSusceptible) &&
      expect(community.numInfectious).toBe(oldNumInfectious) &&
      expect(community.numNoninfectious).toBe(oldNumNonInfectious) &&
      expect(community.numImmune).toBe(oldNumImmune) &&
      expect(community.numDead).toBe(oldNumDead);
  });

  test('infectious person who is destined to immunity should become immune cause it is time', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );
    community.populateCanvas();
    const infectiousPerson = community.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = true;

    // InfectiousTime will be incremeneted by one so they'll be equal
    infectiousPerson.infectiousTime = infectiousPerson.infectiousPeriod - 1;

    const oldNumInfectious = community.numInfectious;
    const oldNumImmune = community.numImmune;

    // Call method
    community.update(infectiousPerson, 1);

    // assert
    expect(infectiousPerson.type).toBe(TYPES.IMMUNE) &&
      expect(infectiousPerson.color).toBe(COLORS.IMMUNE) &&
      expect(community.numInfectious).toBe(oldNumInfectious - 1) &&
      expect(community.numImmune).toBe(oldNumImmune + 1);
  });

  test('infectious person who is destined to immunity should not become immune cause it is not time yet', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );

    community.populateCanvas();
    const infectiousPerson = community.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = true;

    // InfectiousTime will be incremeneted by one so they'll not be equal
    infectiousPerson.infectiousTime = infectiousPerson.infectiousPeriod;

    const oldNumInfectious = community.numInfectious;
    const oldNumImmune = community.numImmune;

    // Call method
    community.update(infectiousPerson);

    // assert
    expect(infectiousPerson.type).toBe(TYPES.INFECTIOUS) &&
      expect(infectiousPerson.color).toBe(COLORS.INFECTIOUS) &&
      expect(community.numInfectious).toBe(oldNumInfectious) &&
      expect(community.numImmune).toBe(oldNumImmune);
  });

  test('infectious person who is neither dead nor immune should be destined to immunity', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );
    community.populateCanvas();
    const infectiousPerson = community.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = false;

    // Mock random to be greater than mortality rate of that person
    mockRandom(infectiousPerson.mortalityRate + 0.01, true);

    // Call method
    community.update(infectiousPerson);

    // assert
    expect(infectiousPerson.destinyDead).toBe(false) &&
      expect(infectiousPerson.destinyImmune).toBe(true);
  });

  test('infectious person who is neither dead nor immune should be destined to death', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 1, 0, 0),
      null
    );
    community.populateCanvas();
    const infectiousPerson = community.population[0];
    infectiousPerson.destinyDead = false;
    infectiousPerson.destinyImmune = false;

    // Mock random to be less than or equal to mortality rate of that person
    mockRandom(infectiousPerson.mortalityRate, true);

    // Call method
    community.update(infectiousPerson);

    // assert
    expect(infectiousPerson.destinyDead).toBe(true) &&
      expect(infectiousPerson.destinyImmune).toBe(false);
  });

  test('handlePersonLeaving num susceptible lower than 0', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(1, 0, 0, 0, 0),
      null
    );
    community.populateCanvas();
    const susPerson = community.population[0];

    community.numSusceptible = -10; // to throw an error!
    expect(() => community.handlePersonLeaving(susPerson)).toThrow(Error);
  });

  test('handlePersonLeaving num susceptible goes down after removing', () => {
    const susCount = 2;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(susCount, 0, 0, 0, 0),
      null
    );
    community.populateCanvas();
    const susPerson = community.population[0];
    community.handlePersonLeaving(susPerson);

    expect(community.numSusceptible).toBe(susCount - 1);
  });

  test('handlePersonLeaving numNonInfectious goes down after removing', () => {
    const nonInfectiousCount = 2;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, nonInfectiousCount, 0, 0, 0),
      null
    );
    community.populateCanvas();
    const nonInfectiousPerson = community.population[0];
    community.handlePersonLeaving(nonInfectiousPerson);

    expect(community.numNonInfectious).toBe(nonInfectiousCount - 1);
  });

  test('handlePersonLeaving numInfectious goes down after removing', () => {
    const infectiousCount = 2;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, infectiousCount, 0, 0),
      null
    );
    community.populateCanvas();
    const infectiousPerson = community.population[0];
    community.handlePersonLeaving(infectiousPerson);

    expect(community.numInfectious).toBe(infectiousCount - 1);
  });

  test('handlePersonLeaving numImmune goes down after removing', () => {
    const immuneCount = 1;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 0, immuneCount, 0),
      null
    );
    community.populateCanvas();
    const immunePerson = community.population[0];
    community.handlePersonLeaving(immunePerson);

    expect(community.numImmune).toBe(immuneCount - 1);
  });

  test('handlePersonLeaving numDead goes down after removing', () => {
    const deadCount = 1;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 0, 0, deadCount),
      null
    );
    community.populateCanvas();
    const deadPerson = community.population[0];
    community.handlePersonLeaving(deadPerson);

    expect(community.numDead).toBe(deadCount - 1);
  });

  test('handlePersonLeaving unknown type throws error', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 0, 0, 0),
      null
    );
    community.populateCanvas();
    const unknownTypePerson = new Person('blabla', 1, 1);

    expect(() => community.handlePersonLeaving(unknownTypePerson)).toThrow();
  });

  test('handlePersonJoining person already exists throws error', () => {
    const susCount = 1;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(susCount, 0, 0, 0, 0),
      null
    );
    community.populateCanvas();

    const susPerson = community.population[0];
    expect(() => community.handlePersonJoining(susPerson)).toThrow();
  });

  test('handlePersonJoining susceptilbe person increments numSusceptible', () => {
    const susCount = 0;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(susCount, 0, 0, 0, 0),
      null
    );
    community.populateCanvas();

    const susPerson = new Person(TYPES.SUSCEPTIBLE, 1, 1);
    community.handlePersonJoining(susPerson);
    expect(community.numSusceptible).toBe(susCount + 1);
  });

  test('handlePersonJoining nonInfectious person increments numNonInfectious', () => {
    const nonInfectiousCount = 0;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, nonInfectiousCount, 0, 0, 0),
      null
    );
    community.populateCanvas();

    const nonInfectiousPerson = new Person(TYPES.NONINFECTIOUS, 1, 1);
    community.handlePersonJoining(nonInfectiousPerson);
    expect(community.numNonInfectious).toBe(nonInfectiousCount + 1);
  });

  test('handlePersonJoining infectious person increments numInfectious', () => {
    const infectiousCount = 0;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, infectiousCount, 0, 0),
      null
    );
    community.populateCanvas();

    const infectiousPerson = new Person(TYPES.INFECTIOUS, 1, 1);
    community.handlePersonJoining(infectiousPerson);
    expect(community.numInfectious).toBe(infectiousCount + 1);
  });

  test('handlePersonJoining immune person increments numImmune', () => {
    const immuneCount = 0;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 0, immuneCount, 0),
      null
    );
    community.populateCanvas();

    const immunePerson = new Person(TYPES.IMMUNE, 1, 1);
    community.handlePersonJoining(immunePerson);
    expect(community.numImmune).toBe(immuneCount + 1);
  });

  test('handlePersonJoining dead person increments numDead', () => {
    const deadCount = 0;
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 0, 0, deadCount),
      null
    );
    community.populateCanvas();

    const deadPerson = new Person(TYPES.DEAD, 1, 1);
    community.handlePersonJoining(deadPerson);
    expect(community.numDead).toBe(deadCount + 1);
  });

  test('handlePersonJoining unknown type throws error', () => {
    const community = new Community(
      1,
      new Bounds(0, 100, 0, 100),
      new Stats(0, 0, 0, 0, 0),
      null
    );
    community.populateCanvas();

    const unknownTypePerson = new Person('blablalbal', 1, 1);
    expect(() => community.handlePersonJoining(unknownTypePerson)).toThrow();
  });
});
