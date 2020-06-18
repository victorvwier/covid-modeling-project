import presetsManager from './presetsManager';
import { COLORS, TYPES } from './CONSTANTS';
import { getRandom } from './util';

/** @class Person describing a person in the model. */
export default class Person {
  /**
   * Instantiates a person.
   *
   * @constructor
   * @param {TYPE} type The state the person starts in.
   * @param {number} x The initial X coordinate of the person.
   * @param {number} y The initial Y coordinate of the person.
   * @param {number} communityId The ID referring to the community the person starts in.
   */
  constructor(type, x, y, communityId) {
    this.communityId = communityId;
    this.type = type;
    this.radius = presetsManager.loadPreset().PERSON_RADIUS;
    this.infectionRadius = presetsManager.loadPreset().INFECTION_RADIUS;
    this.x = x;
    this.y = y;
    this.maxSpeed = presetsManager.loadPreset().POPULATION_SPEED;
    this.repulsionForce = presetsManager.loadPreset().REPULSION_FORCE;
    this.speedX = 3 * (Math.floor(getRandom() * 2) || -1);
    this.speedY = 3 * (Math.floor(getRandom() * 2) || -1);
    this.accX = 0;
    this.accY = 0;
    this.asymptomaticTime = 0;
    this.symptomaticTime = 0;
    this.incubationTime = 0;
    this.infectiousTime = 0;
    this.destinyDead = false;
    this.destinyImmune = false;
    this.incubationPeriod = 0;
    this.infectiousPeriod = 0;
    this.age = null;
    this.gender = null;
    this.mortalityRate = null;

    this.inIcu = false;

    this.relocating = false;

    this.step = presetsManager.loadPreset().RELOCATION_STEP_SIZE;

    if (type === TYPES.SUSCEPTIBLE) this.color = COLORS.SUSCEPTIBLE;
    else if (type === TYPES.INFECTIOUS) this.color = COLORS.INFECTIOUS;
    else if (type === TYPES.NONINFECTIOUS) this.color = COLORS.NONINFECTIOUS;
    else if (type === TYPES.DEAD) this.color = COLORS.DEAD;
    else if (type === TYPES.IMMUNE) this.color = COLORS.IMMUNE;
    this.testedPositive = false;
  }

  /**
   * A function applying a force to the person.
   *
   * @param {number} forceX The component of the force parallel to the X axis.
   * @param {number} forceY The component of the force parallel to the Y axis.
   */
  applyForce(forceX, forceY) {
    this.accX += forceX; // Plus symbol because we're adding forces together
    this.accY += forceY;
  }

  /**
   * A function to check if this person is dead
   * @returns {Boolean} boolean representing whether a person is dead
   */
  isDead() {
    return this.type === TYPES.DEAD;
  }

  /**
   * A function handling a person attempting to move out of bounds along the X axis.
   *
   * @param {number} startX The lower bound on the X axis.
   * @param {number} endX The upper bound on the X axis.
   */
  _handleXOutOfBounds(startX, endX) {
    if (this.x > endX - 2 * this.radius || this.x < startX + 2 * this.radius) {
      if (this.x > endX - 2 * this.radius) this.x = endX - 2 * this.radius;
      else if (this.x < startX + 2 * this.radius)
        this.x = startX + 2 * this.radius;
      this.speedX *= -1;
    }
  }

  /**
   * A function handling a person attempting to move out of bounds along the Y axis.
   *
   * @param {number} startY The lower bound on the Y axis.
   * @param {number} endY The upper bound on the Y axis.
   */
  _handleYOutOfBounds(startY, endY) {
    if (this.y > endY - 2 * this.radius || this.y < startY + 2 * this.radius) {
      if (this.y > endY - 2 * this.radius) this.y = endY - 2 * this.radius;
      else if (this.y < startY + 2 * this.radius)
        this.y = startY + 2 * this.radius;
      this.speedY *= -1;
    }
  }

  /**
   * A function checking if this person exceeds the maximum allowed speed.
   */
  _checkIfExceededMaxSpeed() {
    if (Math.abs(this.speedX) > this.maxSpeed)
      this.speedX = Math.sign(this.speedX) * this.maxSpeed;

    if (Math.abs(this.speedY) > this.maxSpeed)
      this.speedY = Math.sign(this.speedY) * this.maxSpeed;
  }

  /**
   * A function moving a person for a given timestep.
   *
   * @param {number} startX The lower bound along the X axis.
   * @param {number} endX The upper bound along the X axis.
   * @param {number} startY The lower bound along the Y axis.
   * @param {number} endY The upper bound along the Y axis.
   * @param {number} dt The amount of time which passes for this movement.
   */
  move(startX, endX, startY, endY, dt) {
    this.applyForce(getRandom() - 0.5, getRandom() - 0.5);

    this.speedX += this.accX * dt;
    this.speedY += this.accY * dt;

    this._checkIfExceededMaxSpeed();

    this.x += this.speedX * dt;
    this.y += this.speedY * dt;

    this._handleXOutOfBounds(startX, endX);
    this._handleYOutOfBounds(startY, endY);

    // Slow the agents down a bit, remove some energy from the system
    this.speedY *= 0.95 ** dt;
    this.speedX *= 0.95 ** dt;

    this.accX *= 0;
    this.accY *= 0;
  }

  /**
   * A function retrieving the step a person will take towards its destination.
   *
   * @param {number} current The current coordinate of the person.
   * @param {number} destination The coordinate of the persons destination.
   * @returns {number} The step a person will take towards its destination.
   */
  getStep(current, destination) {
    return (destination - current) / this.step;
  }

  /**
   * A function moving a relocating person.
   *
   * @param {Object} destination An object containing the coordinates of the destination of the person.
   */
  relocateMove({ x: destX, y: destY }) {
    this.applyForce(this.getStep(this.x, destX), this.getStep(this.y, destY));
    this.speedX += this.accX;
    this.speedY += this.accY;

    this.x += this.speedX;
    this.y += this.speedY;

    this.accX *= 0;
    this.accY *= 0;

    // Slow the agents down a bit, remove some energy from the system
    this.speedY *= 0.95;
    this.speedX *= 0.95;
  }

  /**
   * A function determining if a person is within the distance to infect another person.
   *
   * @param {Person} p The other person the check is made over.
   * @param {Number} range the infectious range of a person to determing if the other person is close enough for an infection.
   * @returns {Boolean} A boolean representing whether the two people are within each others infection radius.
   */
  isInRange(p, range) {
    const deltaX = this.x - p.x;
    const deltaY = this.y - p.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return dist < range; // Collide on infectionraduis
  }

  /**
   * A function setting the proper attributes for a Non-Infectious person.
   */
  startIncubation() {
    this.type = TYPES.NONINFECTIOUS;
    this.color = COLORS.NONINFECTIOUS;
  }

  /**
   * A function to set the incubation time of the person.
   *
   * @param {number} val The new incubation time.
   */
  setIncubationPeriod(val) {
    this.incubationPeriod = val;
  }

  /**
   * A function to set the infectious time of the person.
   *
   * @param {number} val The new infectious period.
   */
  setInfectiousPeriod(val) {
    this.infectiousPeriod = val;
  }

  /**
   * A function to set the proper attributes of an immune person.
   */
  becomesImmune() {
    this.type = TYPES.IMMUNE;
    this.color = COLORS.IMMUNE;
  }

  /**
   * A function to set the proper attributes of an infectious person.
   */
  becomesInfectious() {
    this.type = TYPES.INFECTIOUS;
    this.color = COLORS.INFECTIOUS;
  }

  /**
   * A function pushing this person away from another person.
   *
   * @param {Person} p The person to be repelled.
   */
  repel(p) {
    const delta = { x: this.x - p.x, y: this.y - p.y };
    const dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y);

    if (delta.x !== 0) {
      const unitX = delta.x / dist;
      const vecX = (unitX / dist) * this.repulsionForce * 0.01;
      this.applyForce(vecX, 0);
    }

    if (delta.y !== 0) {
      const unitY = delta.y / dist;
      const vecY = (unitY / dist) * this.repulsionForce * 0.01;
      this.applyForce(0, vecY);
    }
  }

  /**
   * A function saying if we can infect a person.
   *
   * @param {Person} p The person which we want to know can be infected.
   * @returns {Boolean} A boolean representing if the other person can be infected.
   */
  canInfect(p) {
    return this.type === TYPES.INFECTIOUS && p.type === TYPES.SUSCEPTIBLE &&
     Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2) <= p.infectionRadius + this.infectionRadius;
  }

  /**
   * A function setting the age of a person.
   *
   * @param {number} value The new age of the person.
   */
  initializeAge(value) {
    this.age = value;
  }
}
