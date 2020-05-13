import wireSlidersToHandlers from './DOM/parameters';
import Model from './model';
import Stats from './data/stats';
import Bounds from './data/bounds';
import { SPACE_BETWEEN_COMMUNITIES } from './CONSTANTS';

export default class Community {
  constructor(numModels, agentView, width, height, stats, updateStats) {
    this.numModels = numModels;
    this.communities = {};
    this.height = height;
    this.width = width;
    this.stats = stats;
    this.agentView = agentView;
    this.updateStats = updateStats;

    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
    window.community = this;
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
      // wireSlidersToHandlers(this.communities[i]);
    }
  }

  _createIncrementals() {
    return [new Bounds(20, 60, 20, 60), new Bounds(320, 400, 20, 50)];
    // const listOfBounds = [];
    // // Space between each of the models + 2 on the sides
    // const oneModelWidth =
    //   (this.width -
    //     this.numModels * SPACE_BETWEEN_COMMUNITIES -
    //     2 * SPACE_BETWEEN_COMMUNITIES) /
    //   this.numModels;
    // const oneModelHeight =
    //   (this.height -
    //     this.numModels * SPACE_BETWEEN_COMMUNITIES -
    //     2 * SPACE_BETWEEN_COMMUNITIES) /
    //   this.numModels;
    // let currentX = 0;
    // let currentY = 0;
    // for (let i = 0; i < this.numModels; i++) {
    //   currentX += SPACE_BETWEEN_COMMUNITIES;
    //   currentY += SPACE_BETWEEN_COMMUNITIES;
    //   listOfBounds.push(
    //     new Bounds(
    //       currentX,
    //       currentX + oneModelWidth,
    //       currentY,
    //       currentY + oneModelHeight
    //     )
    //   );
    //   currentX += oneModelWidth;
    //   currentY += oneModelHeight;
    // }
    // return listOfBounds;
  }

  setupCommunity() {
    const dividedStats = new Stats(
      this.numSusceptible / this.numModels,
      this.numNonInfectious / this.numModels,
      this.numInfectious / this.numInfectious,
      this.numDead / this.numModels,
      this.numImmune / this.numModels
    );
    const bounds = this._createIncrementals();

    for (let i = 0; i < this.numModels; i++) {
      this.communities[i] = new Model(
        i,
        this.agentView,
        bounds[i],
        dividedStats,
        this.compileStats.bind(this)
      );

      // DEBUG
      window.model = this.communities[i];
      wireSlidersToHandlers(this);
    }
  }

  compileStats() {
    const stats = Object.values(this.communities)
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

    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
    this.updateStats(stats);
  }

  resetCommunity(stats) {
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;

    const dividedStats = new Stats(
      this.numSusceptible / this.numModels,
      this.numNonInfectious / this.numModels,
      this.numInfectious / this.numInfectious,
      this.numDead / this.numModels,
      this.numImmune / this.numModels
    );
    Object.values(this.communities).forEach((m) => m.resetModel(dividedStats));
  }

  // SLIDER HANDLER METHODS

  updateAgentSize(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setPersonRadius(newValue)
    );
  }

  updateInfectionRadius(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setInfectionRadius(newValue)
    );
  }

  updateMinTimeUntilDead(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setMinTimeUntilDead(newValue)
    );
  }

  updateMaxTimeUntilDead(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setMaxTimeUntilDead(newValue)
    );
  }

  updateMinInfectiousTime(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setMinInfectiousTime(newValue)
    );
  }

  updateMaxInfectiousTime(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setMaxInfectiousTime(newValue)
    );
  }

  updateMinIncubationTime(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setMinIncubationTime(newValue)
    );
  }

  updateMaxIncubationTime(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setMaxIncubationTime(newValue)
    );
  }

  updateTransmissionProb(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setTransmissionProb(newValue)
    );
  }

  updateNonInToImmuneProb(newValue) {
    Object.values(this.communities).forEach((model) =>
      model.setNonInToImmuneProb(newValue)
    );
  }
}
