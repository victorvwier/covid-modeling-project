import Person from './person';
import { getRandom } from './util';
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
    numImmune
  ) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.population = [];
    this.numSusceptible = numSusceptible;
    this.numInfected = numInfected;
    this.numImmune = numImmune;
    this.numImmune = numImmune;
    this.numAsymptomatic = numAsymptomatic;
    this.asymptomaticProb = ASYMPTOMATIC_PROB;
    this.timeUntilSymptoms = TIME_UNTIL_SYMPTOMS;
    this.timeUntilDetection = TIME_UNTIL_DETECTION;
    this.infectionRadius = INFECTION_RADIUS;
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
      const x = getRandom(PERSON_RADIUS, this.width - PERSON_RADIUS);
      const y = getRandom(PERSON_RADIUS, this.height - PERSON_RADIUS);
      this.population.push(new Person(type, x, y, this.context));
    }
  }

  drawPopulation() {
    for (let i = 0; i < this.totalPopulation; i++) {
      // TODO: Maybe?
      this.population[i].draw();
    }
  }

  updatePopulation() {
    for (let i = 0; i < this.totalPopulation; i++) {
      if (!this.population[i].removed) {
        this.population[i].maxSpeed = POPULATION_SPEED;
        this.population[i].move();
      }
    }
  }

  loop() {
    requestAnimationFrame(this.loop.bind(this));
    this.context.clearRect(0, 0, this.width, this.height);

    // applyForces();
    this.updatePopulation();
    this.interactPopulation();
    this.drawPopulation();
  }

  interactPopulation() {
    for (let i = 0; i < this.totalPopulation; i++) {
      for (let j = 0; j < this.totalPopulation; j++) {
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
      this.numAsymptomatic++;
      this.numSusceptible--;
    } else {
      person.type = TYPES.INFECTED;
      person.color = COLORS.INFECTED;
      this.numInfected++;
      this.numSusceptible--;
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
    setInterval(intervalFunc.bind(this), 2000);
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
        this.numRemoved += 1;
      } else {
        person.symptomaticTime += 1;
        if (person.symptomaticTime === this.timeUntilDetection) {
          person.type = TYPES.IMMUNE;
          person.color = COLORS.IMMUNE;
          this.numInfected -= 1;
          this.numRemoved += 1;
        }
      }
    }
  }

  resetModel() {
    console.log('clicked');
  }
}
