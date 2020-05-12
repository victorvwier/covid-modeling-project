import wireSlidersToHandlers from './DOM/parameters';
import Model from './model';
import Stats from './data/stats';

export default class Community {
  constructor(numModels, agentView, width, height, stats, updateStats) {
    this.numModels = numModels;
    this.communities = {};
    this.height = height;
    this.widht = width;
    this.stats = stats;
    this.agentView = agentView;
    this.updateStats = updateStats;

    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;

    window.Community = this;
  }

  // one large population
  // we assign ids and types
  // we pass these stats to models

  // setup method (initializes models)
  setup() {
    // initialize all models
    // population
  }

  run() {
    console.log(this.communities);
    for (let i = 0; i < this.numModels; i++) {
      this.communities[i].populateCanvas();
      this.communities[i].drawPopulation();
      this.communities[i].setup();
      this.communities[i].loop();
      wireSlidersToHandlers(this.communities[i]);
    }
  }

  setupCommunity() {
    const dividedStats = new Stats(
      this.numSusceptible / this.numModels,
      this.numNonInfectious / this.numModels,
      this.numInfectious / this.numInfectious,
      this.numDead / this.numModels,
      this.numImmune / this.numModels
    );
    console.log(dividedStats);

    for (let i = 0; i < this.numModels; i++) {
      this.communities[i] = new Model(
        i,
        this.agentView,
        this.width,
        this.height,
        dividedStats,
        this.updateStats
      );
    }
  }

  compileStats() {
    const stats = this.communities
      .map((m) => m.exportStats())
      .reduce(
        (acc, cur) =>
          new Stats(
            acc.susceptible + cur.susceptible,
            acc.noninfectious + cur.noninfectious,
            acc.infectious + cur.infectious,
            acc.dead + cur.dead,
            acc.immune + cur.immune
          )
      );
    this.updateStats(stats);
  }

  resetCommunity() {}

  // relocation method

  //
}
