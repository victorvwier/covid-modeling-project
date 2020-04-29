/* eslint-disable no-param-reassign */
import Person from './person';
import { getRandom } from './util';
import { getInitialNumInfected, getInitialNumSusceptable } from './parameters';
import {
  PERSON_RADIUS,
  POPULATION_SPEED,
  INFECTION_RADIUS,
  TIME_UNTIL_DETECTION,
  TIME_UNTIL_SYMPTOMS,
  MORTALITY_RATE,
  TYPES,
  ASYMPTOMATIC_PROB,
  COLORS,
} from './CONSTANTS';

export default class Model {
  constructor(
    context,
    width,
    height,
    numSusceptible,
    numInfected,
    numAsymptomatic,
    numDead,
    numImmune,
    chart
  ) {
    // REMOVE THIS (This should be handled differently)
    this.chart = chart;

    this._intervalFun = null;
    this._animationFrame = null;
    this.context = context;
    this.width = width;
    this.height = height;
    this.population = [];
    this.numSusceptible = numSusceptible;
    this.numInfected = numInfected;
    this.numImmune = numImmune;
    this.numDead = numDead;
    this.numAsymptomatic = numAsymptomatic;
    this.asymptomaticProb = ASYMPTOMATIC_PROB;
    this.timeUntilSymptoms = TIME_UNTIL_SYMPTOMS;
    this.timeUntilDetection = TIME_UNTIL_DETECTION;
    this.infectionRadius = INFECTION_RADIUS;
    this.personRadius = PERSON_RADIUS;
    this.totalPopulation =
      numSusceptible + numInfected + numDead + numImmune + numAsymptomatic;
  }

  set setTimeUntilSymptoms(newValue) {
    this.timeUntilSymptoms = newValue;
  }

  set setTimeUntilDetection(newValue) {
    this.timeUntilDetection = newValue;
  }

  set setInfectionRadius(newValue) {
    this.infectionRadius = newValue;
    this.updateInfectionRadius(newValue);
  }

  set setPersonRadius(newValue) {
    this.personRadius = newValue;
    this.updateRadius(newValue);
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
    this.populateCanvasWithType(TYPES.INFECTED, this.numInfected);
    this.populateCanvasWithType(TYPES.DEAD, this.numDead);
    this.populateCanvasWithType(TYPES.IMMUNE, this.numImmune);
    this.populateCanvasWithType(TYPES.ASYMPTOMATIC, this.numAsymptomatic);
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
            if (this.population[i].canInfect(this.population[j])) {
              this.population[i].hasInfectedCount += 1;
              this.infect(this.population[j]);
            }
          }
        }
      }
    }
  }

  infect(person) {
    if (Math.random() < this.asymptomaticProb) {
      person.type = TYPES.ASYMPTOMATIC;
      person.color = COLORS.ASYMPTOMATIC;
      this.numAsymptomatic += 1;
      this.numSusceptible -= 1;
    } else {
      person.type = TYPES.INFECTED;
      person.color = COLORS.INFECTED;
      this.numInfected += 1;
      this.numSusceptible -= 1;
    }
  }

  setup() {
    const intervalFunc = () => {
      for (let i = 0; i < this.totalPopulation; i++) {
        if (!this.population[i].dead) {
          this.update(this.population[i]);
        }
      }
    };

    // Bind this so that it can access this instace variables
    this._intervalFun = setInterval(intervalFunc.bind(this), 2000);

    setInterval(
      () =>
        this.chart.updateValues(
          this.numSusceptible,
          this.numAsymptomatic,
          this.numInfected,
          this.numImmune,
          this.numDead
        ),

      100
    );
  }

  // Decided to implement this in model, but could move to person
  update(person) {
    if (person.type === TYPES.ASYMPTOMATIC) {
      person.asymptomaticTime += 1;
      if (person.asymptomaticTime === this.timeUntilSymptoms) {
        person.developSymptoms();
        this.numAsymptomatic -= 1;
        this.numInfected += 1;
      }
    }
    if (person.type === TYPES.INFECTED) {
      // TODO: this is where we will split removed into dead and recovered + immune
      if (Math.random() < MORTALITY_RATE) {
        person.dead = true;
        person.color = COLORS.DEAD;
        this.numInfected -= 1;
        this.numDead += 1;
      } else {
        person.symptomaticTime += 1;
        if (person.symptomaticTime === this.timeUntilDetection) {
          person.type = TYPES.IMMUNE;
          person.color = COLORS.IMMUNE;
          this.numInfected -= 1;
          this.numImmune += 1;
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

  // CONTINUE
  currentValues() {
    return [
      this.numSusceptible,
      this.numAsymptomatic,
      this.numInfected,
      this.numImmune,
      this.dead,
    ];
  }

  resetModel() {
    // Get values for new run
    const newInitSusceptable = getInitialNumSusceptable();
    const newInitInfected = getInitialNumInfected();

    console.log(
      `New Values: sus: ${newInitSusceptable}, inf: ${newInitInfected}`
    );

    // clear the current running interval
    clearInterval(this._intervalFun);
    cancelAnimationFrame(this._animationFrame);

    // Set new values and reset to init
    this.population = [];
    this.numSusceptible = newInitSusceptable;
    this.numInfected = newInitInfected;
    this.numImmune = 0;
    this.numAsymptomatic = 0;
    this.totalPopulation = newInitSusceptable + newInitInfected;

    // clear the canvas
    this.context.clearRect(0, 0, this.width, this.height);

    // start the loop again
    this.populateCanvas();
    this.drawPopulation();
    this.setup();
    this.loop();
  }
}
