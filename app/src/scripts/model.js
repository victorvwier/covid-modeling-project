import Person from './person';
import { getRandom, gaussianRand, mortalityStat } from './util';

import {
  PERSON_RADIUS,
  POPULATION_SPEED,
  INFECTION_RADIUS,
  TYPES,
  NONIN_TO_IMMUNE_PROB,
  COLORS,
  TRANSMISSION_PROB,
  MIN_INCUBATION_TIME,
  MAX_INCUBATION_TIME,
  MIN_INFECTIOUS_TIME,
  MAX_INFECTIOUS_TIME,
  MIN_TIME_UNTIL_DEAD,
  MAX_TIME_UNTIL_DEAD,
  RELOCATION_PROBABILITY,
} from './CONSTANTS';
import Stats from './data/stats';
import Coordinate from './data/coordinate';

export default class Model {
  constructor(id, bounds, stats, compileStats, registerRelocation) {
    // Experimental
    this.registerRelocation = registerRelocation;

    // Intervals
    this._chartInterval = null;
    this._updatePopulationInterval = null;

    // state methods from main
    this.id = id;
    this.spareRandom = null;

    this.startX = bounds.startX;
    this.endX = bounds.endX;
    this.startY = bounds.startY;
    this.endY = bounds.endY;

    this.population = [];
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
    this.compileStats = compileStats;
    this.nonInfectiousToImmuneProb = NONIN_TO_IMMUNE_PROB;
    this.infectionRadius = INFECTION_RADIUS;
    this.personRadius = PERSON_RADIUS;
    this.transmissionProb = TRANSMISSION_PROB;

    this.minIncubationTime = MIN_INCUBATION_TIME;
    this.maxIncubationTime = MAX_INCUBATION_TIME;

    this.minInfectiousTime = MIN_INFECTIOUS_TIME;
    this.maxInfectiousTime = MAX_INFECTIOUS_TIME;

    this.minTimeUntilDead = MIN_TIME_UNTIL_DEAD;
    this.maxTimeUntilDead = MAX_TIME_UNTIL_DEAD;

    this.relocationProbability = RELOCATION_PROBABILITY;

    this.totalPopulation =
      this.numSusceptible +
      this.numInfectious +
      this.numDead +
      this.numImmune +
      this.numNonInfectious;
  }

  handlePersonLeaving(person) {
    this.totalPopulation--;

    this.population = this.population.filter((p) => p !== person);

    switch (person.type) {
      case TYPES.SUSCEPTIBLE:
        this.numSusceptible--;
        break;
      case TYPES.NONINFECTIOUS:
        this.numNonInfectious--;
        break;
      case TYPES.INFECTIOUS:
        this.numInfectious--;
        break;
      case TYPES.IMMUNE:
        this.numImmune--;
        break;
      case TYPES.DEAD:
        this.numDead--;
        break;
      default:
        console.log('What type am i');
    }
  }

  handlePersonJoining(person) {
    this.totalPopulation++;

    if (this.population.includes(person)) {
      console.log('But im already here');
    }

    this.population.push(person);

    switch (person.type) {
      case TYPES.SUSCEPTIBLE:
        this.numSusceptible++;
        break;
      case TYPES.NONINFECTIOUS:
        this.numNonInfectious++;
        break;
      case TYPES.INFECTIOUS:
        this.numInfectious++;
        break;
      case TYPES.IMMUNE:
        this.numImmune++;
        break;
      case TYPES.DEAD:
        this.numDead++;
        break;
      default:
        console.log('What type am i');
    }
  }

  setTransmissionProb(newValue) {
    this.transmissionProb = newValue;
  }

  setNonInToImmuneProb(newValue) {
    this.nonInfectiousToImmuneProb = newValue;
  }

  setMinIncubationTime(newValue) {
    this.minIncubationTime = newValue;
  }

  setMaxIncubationTime(newValue) {
    this.maxIncubationTime = newValue;
  }

  setMinInfectiousTime(newValue) {
    this.minInfectiousTime = newValue;
  }

  setMaxInfectiousTime(newValue) {
    this.maxInfectiousTime = newValue;
  }

  setMinTimeUntilDead(newValue) {
    this.minTimeUntilDead = newValue;
  }

  setMaxTimeUntilDead(newValue) {
    this.maxTimeUntilDead = newValue;
  }

  setInfectionRadius(newValue) {
    this.infectionRadius = newValue;
    this.updateInfectionRadius(newValue);
  }

  setPersonRadius(newValue) {
    this.personRadius = newValue;
    this.updateRadius(newValue);
  }

  /**
   * Method used to update the stats in main
   */
  exportStats() {
    const stats = new Stats(
      this.numSusceptible,
      this.numNonInfectious,
      this.numInfectious,
      this.numDead,
      this.numImmune
    );
    return stats;
  }

  updateRadius(newValue) {
    for (let i = 0; i < this.totalPopulation; i++) {
      this.population[i].radius = newValue;
    }
  }

  updateInfectionRadius(newValue) {
    for (let i = 0; i < this.totalPopulation; i++) {
      this.population[i].infectionRadius = newValue;
    }
  }

  populateCanvas() {
    this.populateCanvasWithType(TYPES.SUSCEPTIBLE, this.numSusceptible);
    this.populateCanvasWithType(TYPES.INFECTIOUS, this.numInfectious);
    this.populateCanvasWithType(TYPES.DEAD, this.numDead);
    this.populateCanvasWithType(TYPES.IMMUNE, this.numImmune);
    this.populateCanvasWithType(TYPES.NONINFECTIOUS, this.numNonInfectious);
  }

  populateCanvasWithType(type, count) {
    for (let i = 0; i < count; i++) {
      const x = getRandom(
        this.startX + this.personRadius,
        this.endX - this.personRadius
      );
      const y = getRandom(
        this.startY + this.personRadius,
        this.endY - this.personRadius
      );
      const newPerson = new Person(type, x, y, this.id);
      if (type === TYPES.DEAD) {
        newPerson.dead = true;
      }
      this.population.push(newPerson);
    }
  }

  getDrawInfo() {
    const positions = [];
    const colors = [];
    let count = 0;
    for (let i = 0; i < this.totalPopulation; i++) {
      if (!this.population[i].dead) {
        positions.push(this.population[i].x);
        positions.push(this.population[i].y);
        colors.push(parseInt(this.population[i].color.slice(1, 3), 16) / 255.0);
        colors.push(parseInt(this.population[i].color.slice(3, 5), 16) / 255.0);
        colors.push(parseInt(this.population[i].color.slice(5, 7), 16) / 255.0);
        colors.push(1);
        count++;
      }
    }
    return {
      positions: positions,
      colors: colors,
      size: this.personRadius,
      count: count,
    };
  }

  updatePopulation() {
    for (let i = 0; i < this.totalPopulation; i += 1) {
      const currentPerson = this.population[i];
      if (!currentPerson.dead) {
        if (
          Math.random() < RELOCATION_PROBABILITY &&
          !currentPerson.relocating
        ) {
          currentPerson.relocating = true;
          this.registerRelocation(currentPerson);

          // Add other case person is now moving
        } else if (currentPerson.relocating) {
          currentPerson.relocateMove();
        } else {
          currentPerson.maxSpeed = POPULATION_SPEED;
          currentPerson.move(this.startX, this.endX, this.startY, this.endY);
        }
      }
    }
  }

  getRandomPoint() {
    return new Coordinate(
      getRandom(this.startX, this.endX),
      getRandom(this.startY, this.endY)
    );
  }

  interactPopulation() {
    for (let i = 0; i < this.totalPopulation; i += 1) {
      for (let j = 0; j < this.totalPopulation; j += 1) {
        if (
          i !== j &&
          this.population[i].metWith(
            this.population[j],
            this.infectionRadius
          ) &&
          this.population[i].canInfect(this.population[j]) &&
          Math.random() <= this.transmissionProb
        ) {
          this.population[j].startIncubation();
          this.population[j].setIncubationPeriod(
            gaussianRand(this.minIncubationTime, this.maxIncubationTime)
          );
          this.numNonInfectious += 1;
          this.numSusceptible -= 1;
        }
      }
    }
  }

  setup() {
    this.updatePopulationInterval = () => {
      for (let i = 0; i < this.totalPopulation; i++) {
        this.updateState(this.population[i]);
      }
    };
    // Bind this so that it can access this instance variables
    this._updatePopulationInterval = setInterval(
      this.updatePopulationInterval.bind(this),
      250
    );

    // Bind this so that updates can proagate to chart via main
    this._chartInterval = setInterval(this.compileStats, 500);
  }

  // Decided to implement this in model, but could move to person
  updateState(person) {
    if (person.type === TYPES.NONINFECTIOUS) {
      person.incubationTime += 1;
      if (person.incubationTime === person.incubationPeriod) {
        if (Math.random() < this.nonInfectiousToImmuneProb) {
          person.becomesImmune();
          this.numNonInfectious -= 1;
          this.numImmune += 1;
        } else {
          person.becomesInfectious();
          this.numNonInfectious -= 1;
          this.numInfectious += 1;
        }
      }
    } else if (person.type === TYPES.INFECTIOUS) {
      if (!person.destinyDead && !person.destinyImmune) {
        if (Math.random() <= mortalityStat(person.age)) {
          person.destinyDead = true;
          person.setInfectiousPeriod(
            gaussianRand(this.minTimeUntilDead, this.maxTimeUntilDead)
          );
        } else {
          person.destinyImmune = true;
          person.setInfectiousPeriod(
            gaussianRand(this.minInfectiousTime, this.maxInfectiousTime)
          );
        }
      } else if (person.destinyImmune) {
        person.infectiousTime += 1;
        if (person.infectiousTime === person.infectiousPeriod) {
          person.type = TYPES.IMMUNE;
          person.color = COLORS.IMMUNE;
          this.numInfectious -= 1;
          this.numImmune += 1;
        }
      } else {
        person.infectiousTime += 1;
        if (person.infectiousTime === person.infectiousPeriod) {
          person.dead = true;
          person.type = TYPES.DEAD;
          person.color = COLORS.DEAD;
          this.numInfectious -= 1;
          this.numDead += 1;
        }
      }
    }
  }

  loop() {
    // applyForces();
    this.updatePopulation();
    this.interactPopulation();
  }

  pauseExecution() {
    clearInterval(this._chartInterval);
    this._chartInterval = null;
    clearInterval(this._updatePopulationInterval);
    this._updatePopulationInterval = null;
  }

  resumeExecution() {
    this.setup();
    this.loop();
  }

  resetModel(stats) {
    // clear the current running interval
    clearInterval(this._updatePopulationInterval);
    clearInterval(this._chartInterval);

    // Set new values and reset to init
    this.population = [];
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numImmune = stats.immune;
    this.numNonInfectious = stats.noninfectious;
    this.totalPopulation = stats.susceptible + stats.infectious;

    // clear the canvas

    // start the loop again
    this.populateCanvas();
    this.updateInfectionRadius(this.infectionRadius);
    this.updateRadius(this.personRadius);

    this.setup();
    this.loop();
  }
}
