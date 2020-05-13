import {
  PERSON_RADIUS,
  COLORS,
  POPULATION_SPEED,
  TYPES,
  INFECTION_RADIUS,
} from './CONSTANTS';

export default class Person {
  constructor(type, x, y, id) {
    this.id = id;
    this.type = type;
    this.radius = PERSON_RADIUS;
    this.infectionRadius = INFECTION_RADIUS;
    this.x = x;
    this.y = y;
    this.maxSpeed = POPULATION_SPEED;
    this.speedX = 3 * (Math.floor(Math.random() * 2) || -1);
    this.speedY = 3 * (Math.floor(Math.random() * 2) || -1);
    this.accX = 0;
    this.accY = 0;
    this.dead = false;
    this.asymptomaticTime = 0;
    this.symptomaticTime = 0;
    this.incubationTime = 0;
    this.infectiousTime = 0;
    this.destinyDead = false;
    this.destinyImmune = false;
    this.incubationPeriod = 0;
    this.infectiousPeriod = 0;
    this.age = Math.round(Math.random() * 100);

    if (type === TYPES.SUSCEPTIBLE) this.color = COLORS.SUSCEPTIBLE;
    else if (type === TYPES.INFECTIOUS) this.color = COLORS.INFECTIOUS;
    else if (type === TYPES.NONINFECTIOUS) this.color = COLORS.NONINFECTIOUS;
    else if (type === TYPES.DEAD) this.color = COLORS.DEAD;
  }

  applyForce(forceX, forceY) {
    this.accX += forceX;
    this.accY += forceY;
  }

  _handleXOutOfBounds(startX, endX) {
    if (this.x > endX - 2 * this.radius || this.x < startX + 2 * this.radius) {
      if (this.x > endX - 2 * this.radius) this.x = endX - 2 * this.radius;
      else if (this.x < startX + 2 * this.radius)
        this.x = startX + 2 * this.radius;
      this.speedX *= -1;
    }
  }

  _handleYOutOfBounds(startY, endY) {
    if (this.y > endY - 2 * this.radius || this.y < startY + 2 * this.radius) {
      if (this.y > endY - 2 * this.radius) this.y = endY - 2 * this.radius;
      else if (this.y < startY + 2 * this.radius)
        this.y = startY + 2 * this.radius;
      this.speedY *= -1;
    }
  }

  _checkIfExceededMaxSpeed() {
    if (Math.abs(this.speedX) > this.maxSpeed)
      this.speedX = Math.sign(this.speedX) * this.maxSpeed;

    if (Math.abs(this.speedY) > this.maxSpeed)
      this.speedY = Math.sign(this.speedY) * this.maxSpeed;
  }

  move(startX, endX, startY, endY) {
    if (this.type !== TYPES.DEAD) {
      this.applyForce(Math.random() - 0.5, Math.random() - 0.5);
      this.speedX += this.accX;
      this.speedY += this.accY;

      this._handleXOutOfBounds(startX, endX);
      this._handleYOutOfBounds(startY, endY);

      this._checkIfExceededMaxSpeed();

      this.x += this.speedX;
      this.y += this.speedY;

      this.accX *= 0;
      this.accY *= 0;
    }
  }

  metWith(p, threshold) {
    const deltaX = this.x - p.x;
    const deltaY = this.y - p.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return dist < threshold * 2; // Collide on infectionraduis
  }

  startIncubation() {
    this.type = TYPES.NONINFECTIOUS;
    this.color = COLORS.NONINFECTIOUS;
  }

  setIncubationPeriod(val) {
    this.incubationPeriod = val;
  }

  setInfectiousPeriod(val) {
    this.infectiousPeriod = val;
  }

  becomesImmune() {
    this.type = TYPES.IMMUNE;
    this.color = COLORS.IMMUNE;
  }

  becomesInfectious() {
    this.type = TYPES.INFECTIOUS;
    this.color = COLORS.INFECTIOUS;
  }

  canInfect(p) {
    // TODO: Get noninfectious cleared with Thomas
    return (
      (this.type === TYPES.INFECTIOUS || this.type === TYPES.NONINFECTIOUS) &&
      p.type === TYPES.SUSCEPTIBLE
    );
  }

  initializeAge(value) {
    this.age = value;
  }
}
