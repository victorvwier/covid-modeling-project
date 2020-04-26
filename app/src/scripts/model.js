import Person from './person';
import { getRandom } from './util';
import { PERSON_RADIUS, POPULATION_SPEED, INFECTION_RADIUS } from './CONSTANTS';

export default class Model {
  constructor(
    context,
    width,
    height,
    numSusceptible,
    numInfected,
    numRemoved,
    numAsymptomatic
  ) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.population = [];
    this.numSusceptible = numSusceptible;
    this.numInfected = numInfected;
    this.numRemoved = numRemoved;
    this.numAsymptomatic = numAsymptomatic;
    this.totalPopulation =
      numSusceptible + numInfected + numRemoved + numAsymptomatic;
  }

  populateCanvas(type, count) {
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
    const callback = this.loop.bind(this);
    requestAnimationFrame(callback);
    this.context.clearRect(0, 0, this.width, this.height);

    // setValues();
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
            this.population[i].metWith(this.population[j], INFECTION_RADIUS)
          ) {
            console.log('Two people collided');
            // if (this.population[i].canInfect(this.population[j])) {
            //   this.population[i].hasInfectedCount += 1;
            //   this.pulation[j].infect();
            // }
          }
        }
      }
    }
  }
}
