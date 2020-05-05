export default class Stats {
  constructor(susceptible, symptomatic, asymptomatic, dead, immune) {
    this.susceptible = susceptible;
    this.symptomatic = symptomatic;
    this.asymptomatic = asymptomatic;
    this.dead = dead;
    this.immune = immune;
  }
}
