export default class Stats {
  constructor(susceptible, symptomatic, asymptomatic, dead, immune) {
    this.susceptible = susceptible;
    this.symptomatic = symptomatic;
    this.asymptomatic = asymptomatic;
    this.dead = dead;
    this.immune = immune;
  }

  sum() {
    return (
      this.susceptible +
      this.symptomatic +
      this.asymptomatic +
      this.dead +
      this.immune
    );
  }
}
