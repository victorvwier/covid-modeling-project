export default class Stats {
  constructor(susceptible, noninfectious, infectious, dead, immune) {
    this.susceptible = susceptible;
    this.noninfectious = noninfectious;
    this.infectious = infectious;
    this.dead = dead;
    this.immune = immune;
  }

  sum() {
    return (
      this.susceptible +
      this.noninfectious +
      this.infectious +
      this.dead +
      this.immune
    );
  }

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
