import Person from './person';
import { getRandom } from './util';

import {
  PERSON_RADIUS,
  POPULATION_SPEED,
  INFECTION_RADIUS,
  TIME_UNTIL_IMMUNE,
  MORTALITY_RATE,
  TYPES,
  ASYMPTOMATIC_PROB,
  INCUBATION_PERIOD,
  NONIN_TO_IMMUNE_PROB,
  COLORS,
  TRANSMISSION_PROB,
  TIME_UNTIL_DEAD,
} from './CONSTANTS';
import Stats from './data/stats';

export default class Model {
  constructor(context, width, height, stats, getStats, updateStats) {
    // Intervals + animationFrame
    this._chartInterval = null;
    this._updatePopulationInterval = null;
    this._animationFrame = null;

    // state methods from main
    this.getStats = getStats;
    this.updateStats = updateStats;

    this.context = context;
    this.width = width;
    this.height = height;
    this.population = [];
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
    this.incubationPeriod = INCUBATION_PERIOD;
    this.asymptomaticProb = ASYMPTOMATIC_PROB;
    this.nonInfectiousToImmuneProb = NONIN_TO_IMMUNE_PROB;
    //this.timeUntilSymptoms = TIME_UNTIL_SYMPTOMS;
    this.timeUntilImmune = TIME_UNTIL_IMMUNE;
    this.infectionRadius = INFECTION_RADIUS;
    this.personRadius = PERSON_RADIUS;
    this.transmissionProb = TRANSMISSION_PROB;
    this.timeUntilDead = TIME_UNTIL_DEAD;
    this.totalPopulation =
      this.numSusceptible +
      this.numInfectious +
      this.numDead +
      this.numImmune +
      this.numNonInfectious;
  }

  setAsymptomaticProb(newValue) {
    this.asymptomaticProb = newValue;
  }

  setTimeUntilSymptoms(newValue) {
    this.timeUntilSymptoms = newValue;
  }

  setTimeUntilImmune(newValue) {
    this.timeUntilImmune = newValue;
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
  handleStateChange() {
    const stats = new Stats(
      this.numSusceptible,
      this.numNonInfectious,
      this.numInfectious,
      this.numDead,
      this.numImmune
    );
    this.updateStats(stats);
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
      const x = getRandom(this.personRadius, this.width - this.personRadius);
      const y = getRandom(this.personRadius, this.height - this.personRadius);
      this.population.push(new Person(type, x, y, this.context));
    }
  }

  drawPopulation() {
    for (let i = 0; i < this.totalPopulation; i++) {
      if (!this.population[i].dead) {
        this.population[i].draw();
      }
    }
  }

  updatePopulation() {
    for (let i = 0; i < this.totalPopulation; i += 1) {
      if (!this.population[i].dead) {
        this.population[i].maxSpeed = POPULATION_SPEED;
        this.population[i].move(this.width, this.height);
      }
    }
  }

  interactPopulation() {
    for (let i = 0; i < this.totalPopulation; i += 1) {
      for (let j = 0; j < this.totalPopulation; j += 1) {
        if (i !== j) {
          if (
            this.population[i].metWith(this.population[j], this.infectionRadius)
          ) {
            if (
              this.population[i].canInfect(this.population[j]) &&
              Math.random() <= this.transmissionProb
            ) {
              //this.population[i].hasSymptomaticCount += 1;
              this.population[j].startIncubation();
              this.numNonInfectious += 1;
              this.numSusceptible -= 1;
            }
          }
        }
      }
    }
  }

  // infect(person) {
  //   person.type = TYPES.NONINFECTIOUS;
  //   person.color = COLORS.NONINFECTIOUS;
  //   this.numNonInfectious += 1;
  //   this.numSusceptible -= 1;
  // }

  setup() {
    const intervalFunc = () => {
      for (let i = 0; i < this.totalPopulation; i++) {
        if (!this.population[i].dead) {
          this.update(this.population[i]);
        }
      }
    };

    // Bind this so that it can access this instace variables
    this._updatePopulationInterval = setInterval(intervalFunc.bind(this), 2000);

    // Bind this so that updates can proagate to chart via main
    this._chartInterval = setInterval(this.handleStateChange.bind(this), 500);
  }

  // Decided to implement this in model, but could move to person
  update(person) {
    if (person.type === TYPES.NONINFECTIOUS) {
      person.incubationTime += 1;
      if (person.incubationTime === this.incubationPeriod) {
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
    }
    if (person.type === TYPES.INFECTIOUS) {
      // TODO: this is where we will split removed into dead and recovered + immune

      if (person.destinyDead === false && person.destinyImmune === false) {
        if (Math.random() < MORTALITY_RATE) {
          person.destinyDead = true;
        } else {
          person.destinyImmune = true;
        }
      }

      if (person.destinyImmune) {
        person.infectiousTime += 1;
        if (person.infectiousTime === TIME_UNTIL_IMMUNE) {
          person.type = TYPES.IMMUNE;
          person.color = COLORS.IMMUNE;
          this.numInfectious -= 1;
          this.numImmune += 1;
        }
      } else {
        person.infectiousTime += 1;
        if (person.infectiousTime === TIME_UNTIL_DEAD) {
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
    this.context.clearRect(0, 0, this.width, this.height);

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
    this.context.clearRect(0, 0, this.width, this.height);

    // start the loop again
    this.populateCanvas();
    this.updateInfectionRadius(this.infectionRadius);
    this.updateRadius(this.personRadius);
    this.drawPopulation();

    this.setup();
    this.loop();
  }
}
