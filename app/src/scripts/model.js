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
  DAYS_PER_SECOND,
  REPULSION_FORCE,
  ATTRACTION_FORCE,
  RELOCATION_PROBABILITY,
  MOVEMENT_TIME_SCALAR,
  RELOCATION_ERROR_MARGIN,
} from './CONSTANTS';
import Stats from './data/stats';
import BoundingBoxStructure from './boundingBox';
import Coordinate from './data/coordinate';

export default class Model {
  constructor(id, bounds, stats, registerRelocation) {
    this.registerRelocation = registerRelocation;

    // Intervals
    this._updatePopulationInterval = null;

    // this._animationFrame = null; TODO you removed this!
    this.lastTimestamp = null;

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

    this.nonInfectiousToImmuneProb = NONIN_TO_IMMUNE_PROB;
    this.infectionRadius = INFECTION_RADIUS;
    this.personRadius = PERSON_RADIUS;
    this.transmissionProb = TRANSMISSION_PROB;
    this.repulsionForce = REPULSION_FORCE;
    this.attractionToCenter = ATTRACTION_FORCE;
    this.minIncubationTime = MIN_INCUBATION_TIME;
    this.maxIncubationTime = MAX_INCUBATION_TIME;

    this.minInfectiousTime = MIN_INFECTIOUS_TIME;
    this.maxInfectiousTime = MAX_INFECTIOUS_TIME;

    this.minTimeUntilDead = MIN_TIME_UNTIL_DEAD;
    this.maxTimeUntilDead = MAX_TIME_UNTIL_DEAD;

    this.maxSpeed = POPULATION_SPEED;
    this.daysPerSecond = DAYS_PER_SECOND;
    this.relocationProbability = RELOCATION_PROBABILITY;

    this.totalPopulation =
      this.numSusceptible +
      this.numInfectious +
      this.numDead +
      this.numImmune +
      this.numNonInfectious;

    this.boundingBoxStruct = new BoundingBoxStructure(
      this.startX,
      this.endX,
      this.startY,
      this.endY,
      10 * INFECTION_RADIUS
    );
  }

  setAttractionToCenter(newValue) {
    this.attractionToCenter = newValue;
  }

  setRepulsionForce(newValue) {
    this.repulsionForce = newValue;
    this.updateRepulsionForce(newValue);
  }

  handlePersonLeaving(person) {
    this.totalPopulation--;

    this.population = this.population.filter((p) => p !== person);

    this.boundingBoxStruct.remove(person);

    switch (person.type) {
      case TYPES.SUSCEPTIBLE:
        if (this.numSusceptible < 0) {
          throw Error('Why?');
        }
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

    person._handleXOutOfBounds(this.startX, this.endX);
    person._handleYOutOfBounds(this.startY, this.endY);

    this.boundingBoxStruct.insert(person);

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
    this.boundingBoxStruct = new BoundingBoxStructure(
      this.startX,
      this.endX,
      this.startY,
      this.endY,
      10 * newValue
    );
    for (let i = 0; i < this.totalPopulation; i++) {
      this.population[i].infectionRadius = newValue;
      this.boundingBoxStruct.insert(this.population[i]);
    }
  }

  updateRepulsionForce(newValue) {
    for (let i = 0; i < this.totalPopulation; i++) {
      this.population[i].repulsionForce = newValue;
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
      // if (type !== TYPES.DEAD) {
      //   // newPerson.dead = true;
      // }
      this.population.push(newPerson);
      this.boundingBoxStruct.insert(newPerson);
    }
  }

  getDrawInfo() {
    const positions = [];
    const colors = [];
    let count = 0;
    for (let i = 0; i < this.totalPopulation; i++) {
      if (!(this.population[i].type === TYPES.DEAD)) {
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

  updatePopulation(dt) {
    for (let i = 0; i < this.totalPopulation; i += 1) {
      const currentPerson = this.population[i];
      this.update(currentPerson, dt);

      // if (currentPerson.type === TYPES.DEAD) {
      //   return;
      // }

      if (Math.random() < RELOCATION_PROBABILITY && !currentPerson.relocating) {
        currentPerson.relocating = true;
        this.registerRelocation(currentPerson);
      } else if (!currentPerson.relocating) {
        this.boundingBoxStruct.remove(currentPerson);
        currentPerson.maxSpeed = this.maxSpeed;
        this.attractToCenter(currentPerson);
        currentPerson.move(
          this.startX,
          this.endX,
          this.startY,
          this.endY,
          dt * MOVEMENT_TIME_SCALAR
        ); // TODO: make slider to
        this.boundingBoxStruct.insert(currentPerson);
      }
    }
  }

  getRandomPoint() {
    return new Coordinate(
      getRandom(
        this.startX + RELOCATION_ERROR_MARGIN,
        this.endX - RELOCATION_ERROR_MARGIN
      ),
      getRandom(
        this.startY + RELOCATION_ERROR_MARGIN,
        this.endY - RELOCATION_ERROR_MARGIN
      )
    );
  }

  interactPopulation(dt) {
    for (let i = 0; i < this.totalPopulation; i += 1) {
      const met = this.boundingBoxStruct.query(this.population[i]);
      for (let j = 0; j < met.length; j += 1) {
        // Social distancing
        // if (this.population[i].type !== TYPES.DEAD && met[j] !== TYPES.DEAD) {
        this.population[i].repel(met[j]);
        // }

        // Infection
        if (
          this.population[i].canInfect(met[j]) &&
          Math.random() <= this.transmissionProb * dt
        ) {
          met[j].startIncubation();
          met[j].setIncubationPeriod(
            gaussianRand(this.minIncubationTime, this.maxIncubationTime)
          );
          this.numNonInfectious += 1;
          this.numSusceptible -= 1;
        }
      }
    }
  }

  // Decided to implement this in model, but could move to person
  update(person, dt) {
    if (person.type === TYPES.NONINFECTIOUS) {
      person.incubationTime += dt;
      if (person.incubationTime >= person.incubationPeriod) {
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
        person.infectiousTime += dt;
        if (person.infectiousTime >= person.infectiousPeriod) {
          person.type = TYPES.IMMUNE;
          person.color = COLORS.IMMUNE;
          this.numInfectious -= 1;
          this.numImmune += 1;
        }
      } else {
        person.infectiousTime += dt;
        if (person.infectiousTime >= person.infectiousPeriod) {
          // person.dead = true;
          person.type = TYPES.DEAD;
          person.color = COLORS.DEAD;
          this.numInfectious -= 1;
          this.numDead += 1;
        }
      }
    }
  }

  step(dt) {
    const daysPassed = (dt / 1000) * this.daysPerSecond;
    this.updatePopulation(daysPassed);
    this.interactPopulation(daysPassed);
  }

  pauseExecution() {
    clearInterval(this._updatePopulationInterval);
    this._updatePopulationInterval = null;
  }

  resumeExecution() {
    this.step(0); // TODO what is the value of timestamp parameter
  }

  attractToCenter(person) {
    // get vector to center
    let forceX = (this.startX + this.endX) / 2.0 - person.x;
    let forceY = (this.startY + this.endY) / 2.0 - person.y;
    // normalize vector to center
    const maxDistance = Math.sqrt(
      ((this.startX + this.endX) / 2) ** 2 +
        ((this.startY + this.endY) / 2) ** 2
    );
    forceX /= maxDistance;
    forceY /= maxDistance;

    person.applyForce(
      this.attractionToCenter * forceX,
      this.attractionToCenter * forceY
    );
  }

  resetModel(stats) {
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
  }
}
