/** @class Stats describing the stats of a community or model. */
export default class Stats {
  constructor(susceptible, noninfectious, infectious, dead, immune) {
    this.susceptible = susceptible;
    this.noninfectious = noninfectious;
    this.infectious = infectious;
    this.dead = dead;
    this.immune = immune;
  }

  /**
   * A function summing all of the stats, giving the total number of people represented.
   *
   * @returns {number} The total number of people.
   */
  sum() {
    return (
      this.susceptible +
      this.noninfectious +
      this.infectious +
      this.dead +
      this.immune
    );
  }

  /**
   * A function allowing us to add together two stats objects.
   *
   * @param {Stats} one An instance of a Stats object to be added.
   * @param {Stats} other An instance of a Stats object to be added.
   * @returns {Stats} An instance of a Stats objects representing both parameters added together.
   */
  static joinStats(one, other) {
    return new Stats(
      one.susceptible + other.susceptible,
      one.noninfectious + other.noninfectious,
      one.infectious + other.infectious,
      one.dead + other.dead,
      one.immune + other.immune
    );
  }
}
