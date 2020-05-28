import { RELOCATION_ERROR_MARGIN } from '../CONSTANTS';

/** @class RelocationInfo describing all relevant information of a person relocating. */
export default class RelocationInfo {
  
  /**
   * Instantiates a RelocationInfo object.
   * 
   * @constructor
   * @param {Person} person The person relocating.
   * @param {Coordinate} destination The coordinate of the destination of the person.
   * @param {number} destId The ID corresponding to the destination community.
   */
  constructor(person, destination, destId) {
    this.person = person;
    this.destination = destination;
    this.destId = destId;
    this.distDiffMargin = RELOCATION_ERROR_MARGIN;
  }

  /**
   * A function checking if the X coordinate of the person is close enough to the destination.
   * 
   * @returns {Boolean} A boolean representing whether our person is close enough.
   */
  _isXInRange() {
    return (
      this.person.x > this.destination.x - this.distDiffMargin &&
      this.person.x < this.destination.x + this.distDiffMargin
    );
  }

  /**
   * A function checking if the Y coordinate of the person is close enough to the destination.
   * 
   * @returns {Boolean} A boolean representing whether our person is close enough.
   */
  _isYInRange() {
    return (
      this.person.y > this.destination.y - this.distDiffMargin &&
      this.person.y < this.destination.y + this.distDiffMargin
    );
  }

  /**
   * A function checking if our person is close enough to its destination.
   * 
   * @returns {Boolean} A boolean representing whether our person is close enough.
   */
  hasArrived() {
    return this._isXInRange() && this._isYInRange();
  }

  /**
   * A function making a person take a step towards his destination.
   */
  takeStep() {
    this.person.relocateMove(this.destination);
  }
}
