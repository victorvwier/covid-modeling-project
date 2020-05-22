import { RELOCATION_ERROR_MARGIN } from '../CONSTANTS';

export default class RelocationInfo {
  constructor(person, destination, destId) {
    this.person = person;
    this.destination = destination;
    this.destId = destId;
    this.distDiffMargin = RELOCATION_ERROR_MARGIN;
  }

  _isXInRange() {
    return (
      this.person.x > this.destination.x - this.distDiffMargin &&
      this.person.x < this.destination.x + this.distDiffMargin
    );
  }

  _isYInRange() {
    return (
      this.person.y > this.destination.y - this.distDiffMargin &&
      this.person.y < this.destination.y + this.distDiffMargin
    );
  }

  hasArrived() {
    return this._isXInRange() && this._isYInRange();
  }

  takeStep() {
    console.log('relocateMovng');
    this.person.relocateMove(this.destination);
  }
}
