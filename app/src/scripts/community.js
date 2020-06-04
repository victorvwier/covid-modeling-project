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
  INTERACTION_RANGE,
  TESTED_POSITIVE_PROBABILITY,
  ICU_PROBABILITY,
  ICU_CAPACITY,
  INFECTION_RADIUS_REDUCTION_FACTOR,
} from './CONSTANTS';
import Stats from './data/stats';
import BoundingBoxStructure from './boundingBox';
import Coordinate from './data/coordinate';

/** @class Community describing a single community within the model. */
export default class Community {
  /**
   * Instatiates a Community.
   *
   * @constructor
   * @param {number} id The ID which can be used to refer to the community.
   * @param {Bounds} bounds An object representing the bounds of the community.
   * @param {Stats} stats The stats object for the community.
   * @param {function} registerRelocation A function to call when a person is relocating.
   */
  constructor(id, bounds, stats, registerRelocation,ctx) {
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

    this.icuCount = 0;

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
      INFECTION_RADIUS
    );

    // These lines are drawm from the edge coordinates of the model and make up the boundary of the
    // communities which are drawn on a canvas other than the agent canvas and can be drawn 
    // automatically regardless of how many models there are.
    ctx.moveTo(this.startX,this.startY);
    ctx.lineTo(this.startX,this.endY);
    ctx.stroke();
    ctx.moveTo(this.startX,this.endY);
    ctx.lineTo(this.endX,this.endY);
    ctx.stroke();
    ctx.moveTo(this.endX,this.endY);
    ctx.lineTo(this.endX,this.startY);
    ctx.stroke();
    ctx.moveTo(this.endX,this.startY);
    ctx.lineTo(this.startX,this.startY);
    ctx.stroke();

  }

  /**
   * A function setting the attraction to the center.
   *
   * @param {number} newValue The new attraction to the center in the community.
   */
  setAttractionToCenter(newValue) {
    this.attractionToCenter = newValue;
  }

  /**
   * A function setting the force with which people repel each other.
   *
   * @param {number} newValue The new Repulsion force.
   */
  setRepulsionForce(newValue) {
    this.repulsionForce = newValue;
    this.updateRepulsionForce(newValue);
  }

  /**
   * A function to handle a person relocating to another community.
   *
   * @param {Person} person The person leaving the community.
   */
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

  /**
   * A function to handle a person relocating to this Community.
   *
   * @param {Person} person The person joining this community.
   */
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

  /**
   * A function to set the probability of transmission between people.
   *
   * @param {number} newValue The new probability of transmission.
   */
  setTransmissionProb(newValue) {
    this.transmissionProb = newValue;
  }

  /**
   * A function to set the probability for a person to move from the Non-Infectious state to the Immune state.
   *
   * @param {number} newValue The new probability for this state transition.
   */
  setNonInToImmuneProb(newValue) {
    this.nonInfectiousToImmuneProb = newValue;
  }

  /**
   * A function to set the minimum time to move from the Non-Infectious state to the Infectious state in this community.
   *
   * @param {number} newValue The new minimum incubation time.
   */
  setMinIncubationTime(newValue) {
    this.minIncubationTime = newValue;
  }

  /**
   * A function to set the maximum time to move from the Non-Infectious state to the Infectious state in this community.
   *
   * @param {number} newValue The new maximum incubation time.
   */
  setMaxIncubationTime(newValue) {
    this.maxIncubationTime = newValue;
  }

  /**
   * A function to set the minimum time to move from the Infectious state to the Immune state in this community.
   *
   * @param {number} newValue The new minimum infectious period.
   */
  setMinInfectiousTime(newValue) {
    this.minInfectiousTime = newValue;
  }

  /**
   * A function to set the maximum time to move from the Infectious state to the Immune state in this community.
   *
   * @param {number} newValue The new maximum infectious period.
   */
  setMaxInfectiousTime(newValue) {
    this.maxInfectiousTime = newValue;
  }

  /**
   * A function to set the minimum time to move from the Infectious state to the Dead state in this community.
   *
   * @param {number} newValue The new minimum time to death.
   */
  setMinTimeUntilDead(newValue) {
    this.minTimeUntilDead = newValue;
  }

  /**
   * A function to set the maximum time to move from the Infectious state to the Dead state in this community.
   *
   * @param {*} newValue The new maximum time to death.
   */
  setMaxTimeUntilDead(newValue) {
    this.maxTimeUntilDead = newValue;
  }

  /**
   * A function to set the infection radius in this community.
   *
   * @param {number} newValue The new Infection radius.
   */
  setInfectionRadius(newValue) {
    this.infectionRadius = newValue;
    this.updateInfectionRadius(newValue);
  }

  /**
   * A function to set the person radius in this community.
   *
   * @param {number} newValue The new radius of the people.
   */
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

  /**
   * Update the radius of people in this community.
   *
   * @param {number} newValue The new radius.
   */
  updateRadius(newValue) {
    for (let i = 0; i < this.totalPopulation; i++) {
      this.population[i].radius = newValue;
    }
  }

  /**
   * Update the infection radius of people in this community.
   *
   * @param {number} newValue The new infection radius.
   */
  updateInfectionRadius(newValue) {
    this.boundingBoxStruct = new BoundingBoxStructure(
      this.startX,
      this.endX,
      this.startY,
      this.endY,
      newValue
    );
    for (let i = 0; i < this.totalPopulation; i++) {
      this.population[i].infectionRadius = newValue;
      this.boundingBoxStruct.insert(this.population[i]);
    }
  }

  /**
   * Update the repulsion force of the people in this community.
   *
   * @param {number} newValue The new repulsion force.
   */
  updateRepulsionForce(newValue) {
    for (let i = 0; i < this.totalPopulation; i++) {
      this.population[i].repulsionForce = newValue;
    }
  }

  /**
   * A function to create a population
   */
  populateCanvas() {
    this.populateCanvasWithType(TYPES.SUSCEPTIBLE, this.numSusceptible);
    this.populateCanvasWithType(TYPES.INFECTIOUS, this.numInfectious);
    this.populateCanvasWithType(TYPES.DEAD, this.numDead);
    this.populateCanvasWithType(TYPES.IMMUNE, this.numImmune);
    this.populateCanvasWithType(TYPES.NONINFECTIOUS, this.numNonInfectious);
  }

  /**
   * A function to create the part of the population which consists of one type
   *
   * @param {TYPES} type The initial state of this part of the population.
   * @param {number} count The amount of people in this part of the population.
   */
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

  /**
   * A function to get the info required to render this community.
   *
   * @returns {Object} An object containing all necessary information for rendering this community.
   */
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

  /**
   * A function to handle all necessary actions to advance this community in time.
   *
   * @param {number} dt The timestep over which to update the population.
   */
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

  /**
   * A function returning a random point in this community.
   *
   * @returns {Coordinate} A random coordinate within this model and the margin of error for relocation
   */
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

  /**
   * A function handling the interactions between the people of the population
   *
   * @param {number} dt The timestep over which the interactions take place.
   */
  interactPopulation(dt) {
    for (let i = 0; i < this.totalPopulation; i += 1) {
      const met = this.boundingBoxStruct.query(
        this.population[i],
        INTERACTION_RANGE
      );
      for (let j = 0; j < met.length; j += 1) {
        // Social distancing
        // if (this.population[i].type !== TYPES.DEAD && met[j] !== TYPES.DEAD) {
        this.population[i].repel(met[j]);
        // }

        // Infection-once an agent is infected there is a chance they will be tested positive.
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
  /**
   * A function handling the updates for a person.
   *
   * @param {Person} person The person for which the update is to be done.
   * @param {number} dt The timestep over which the update is to be calculated.
   */
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
        // Calculate the proabability that a person will die according to real life data according to their age.
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
          if (person.inIcu) {
            this.icuCount -= 1;
            this.updateICUCountOnScreen(this.icuCount);
          }
        }
      } else {
        person.infectiousTime += dt;
        if (person.infectiousTime >= person.infectiousPeriod) {
          // person.dead = true;
          person.type = TYPES.DEAD;
          person.color = COLORS.DEAD;
          this.numInfectious -= 1;
          this.numDead += 1;
          if (person.inIcu) {
            this.icuCount -= 1;
            this.updateICUCountOnScreen(this.icuCount);
          }
        }
      }
      // There is a chance that a infected person gets tested,the higher the TESTED_POSITIVE_PROBABILITY the higher the chance they will get tested.
      if (!person.testedPositive && Math.random() < TESTED_POSITIVE_PROBABILITY * dt) {
        person.testedPositive = true;
        person.infectionRadius /= INFECTION_RADIUS_REDUCTION_FACTOR;
        if (Math.random() < ICU_PROBABILITY) {
          if (this.icuCount >= ICU_CAPACITY) {
            person.type = TYPES.DEAD;
            person.color = COLORS.DEAD;
            this.numInfectious -= 1;
            this.numDead += 1;
          } else {
            person.inIcu = true;
            this.icuCount += 1;
            this.updateICUCuntOnScreen(this.icuCount);
          }
        }
      }
    }
  }

  /**
   * A function to step through the community with a timestep.
   *
   * @param {number} dt The timestep for which to step.
   */
  step(dt) {
    const daysPassed = (dt / 1000) * this.daysPerSecond;
    this.updatePopulation(daysPassed);
    this.interactPopulation(daysPassed);
  }

  /**
   * A function to pause execution of the community.
   */

  pauseExecution() {
    clearInterval(this._updatePopulationInterval);
    this._updatePopulationInterval = null;
  }

  /**
   * A function to resume execution of the community.
   */
  resumeExecution() {
    this.step(0); // TODO what is the value of timestamp parameter
  }

  /**
   * A function to attract a person in the community to its center
   * @param {Person} person The person to be attracted to the center of the community.
   */
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

  /**
   * A function to reset the community.
   *
   * @param {Stats} stats the new Initial stats for the Community.
   */
  resetCommunity(stats) {
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

  updateICUCountOnScreen(icuCount){

  }
}
