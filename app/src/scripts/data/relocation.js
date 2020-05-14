export default class Relocation {
  constructor(origin, person) {
    this.origin = origin;
    this.person = person;
    this.destination = 0;
  }

  setDestination(newValue) {
    this.destination = newValue;
  }
}
