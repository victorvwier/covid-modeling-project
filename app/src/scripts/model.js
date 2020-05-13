import Person from './person';
import { getRandom } from './util';

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
} from './CONSTANTS';
import Stats from './data/stats';

export default class Model {
  constructor(id, agentView, bounds, stats, compileStats) {
    // Intervals + animationFrame
    this._chartInterval = null;
    this._updatePopulationInterval = null;
    this._animationFrame = null;

    // state methods from main
    this.id = id;
    this.spareRandom = null;
    this.agentView = agentView;

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
    // this.incubationPeriod = INCUBATION_PERIOD;
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

    this.totalPopulation =
      this.numSusceptible +
      this.numInfectious +
      this.numDead +
      this.numImmune +
      this.numNonInfectious;
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
      const x = getRandom(this.personRadius, this.endX - this.personRadius);
      const y = getRandom(this.personRadius, this.endY - this.personRadius);
      const newPerson = new Person(type, x, y, 1);
      if (type === TYPES.DEAD) {
        newPerson.dead = true;
      }
      this.population.push(newPerson);
    }
  }

  drawPopulation() {
    const drawInfo = this.getDrawInfo();
    this.agentView.draw(drawInfo);
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
      if (!this.population[i].dead) {
        this.population[i].maxSpeed = POPULATION_SPEED;
        this.population[i].move(this.startX, this.endX, this.startY, this.endY);
      }
    }
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
            this.gaussianRand(this.minIncubationTime, this.maxIncubationTime)
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
        this.update(this.population[i]);
      }
    };
    // Bind this so that it can access this instance variables
    this._updatePopulationInterval = setInterval(
      this.updatePopulationInterval.bind(this),
      2000
    );

    // Bind this so that updates can proagate to chart via main
    // this._chartInterval = setInterval(this.exportStats.bind(this), 500);
    this._chartInterval = setInterval(this.compileStats, 500);
  }

  // Decided to implement this in model, but could move to person
  update(person) {
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
        if (Math.random() <= this.mortalityStat(person.age)) {
          person.destinyDead = true;
          person.setInfectiousPeriod(
            this.gaussianRand(this.minTimeUntilDead, this.maxTimeUntilDead)
          );
        } else {
          person.destinyImmune = true;
          person.setInfectiousPeriod(
            this.gaussianRand(this.minInfectiousTime, this.maxInfectiousTime)
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
    this._animationFrame = requestAnimationFrame(this.loop.bind(this));
    // this.context.clearRect(0, 0, this.width, this.height);

    // applyForces();
    this.updatePopulation();
    this.interactPopulation();
    this.drawPopulation();
  }

  resetModel(stats) {
    // clear the current running interval
    clearInterval(this._updatePopulationInterval);
    clearInterval(this._chartInterval);
    cancelAnimationFrame(this._animationFrame);

    // Set new values and reset to init
    this.population = [];
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numImmune = stats.immune;
    this.numNonInfectious = stats.noninfectious;
    this.totalPopulation = stats.susceptible + stats.infectious;

    // clear the canvas
    // this.context.clearRect(0, 0, this.width, this.height);

    // start the loop again
    this.populateCanvas();
    this.updateInfectionRadius(this.infectionRadius);
    this.updateRadius(this.personRadius);
    this.drawPopulation();

    this.setup();
    this.loop();
  }

  // Normal Distribution Function (min, max, 0)

  gaussianRand(min, max) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) num = this.gaussianRand(min, max);
    num *= max - min;
    num += min;
    return Math.round(num);
  }

  mortalityStat(age) {
    if (0 <= age && age <= 9) {
      return 0;
    } else if (10 <= age && age <= 19) {
      return 0.002;
    } else if (20 <= age && age <= 29) {
      return 0.002;
    } else if (30 <= age && age <= 39) {
      return 0.002;
    } else if (40 <= age && age <= 49) {
      return 0.004;
    } else if (50 <= age && age <= 59) {
      return 0.013;
    } else if (60 <= age && age <= 69) {
      return 0.036;
    } else if (70 <= age && age <= 79) {
      return 0.08;
    } else {
      return 0.148;
    }
  }
}
