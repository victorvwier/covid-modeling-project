import wireSlidersToHandlers from './DOM/parameters';
import Model from './model';

export default class Community {
  constructor(
    numModels,
    agentView,
    width,
    height,
    stats,
    getStats,
    updateStats
  ) {
    this.numModels = numModels;
    this.communities = {};
    this.height = height;
    this.widht = width;
    this.stats = stats;
    this.agentView = agentView;
    this.getStats = getStats;
    this.updateStats = updateStats;
  }

  // setup method (initializes models)
  setup() {
    // initialize all models
    // population
  }

  run() {
    for (let i = 0; i < this.numModels; i++) {
      this.communities[i].populateCanvas();
      this.communities[i].drawPopulation();
      this.communities[i].setup();
      this.communities[i].loop();
      wireSlidersToHandlers(this.communities[i]);
    }
  }

  setupModel() {
    for (let i = 0; i < this.numModels; i++) {
      this.communities[i] = new Model(
        this.agentView,
        // set width and height
        this.width,
        this.height,
        this.stats
      );
    }
  }

  resetCommunity() {}

  // relocation method

  //
}
