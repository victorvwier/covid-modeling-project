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

    this._setValuesFromStatsToLocal(stats);

    window.community = this;
  }

  _createDividedStats() {
    return new Stats(
      Math.round(this.numSusceptible / this.numModels),
      Math.round(this.numNonInfectious / this.numModels),
      Math.round(this.numInfectious / this.numInfectious),
      Math.round(this.numDead / this.numModels),
      Math.round(this.numImmune / this.numModels)
    );
  }

  _setValuesFromStatsToLocal(stats) {
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
  }

  // setup method (initializes models)
  setup() {
    // initialize all models
    // population
  }

  run() {
    for (let i = 0; i < this.numModels; i++) {
      this.communities[i].populateCanvas();
      // this.communities[i].drawPopulation();
      this.communities[i].setup();
      this.communities[i].loop();
      // wireSlidersToHandlers(this.communities[i]);
    }

    this.passDrawInfoToAgentChart();
  }

  passDrawInfoToAgentChart() {
    requestAnimationFrame(this.passDrawInfoToAgentChart.bind(this));
    const allData = Object.values(this.communities)
      .map((com) => com.getDrawInfo())
      .reduce((acc, cur) => ({
        positions: acc.positions.concat(cur.positions),
        colors: acc.colors.concat(cur.colors),
        size: this.communities[0].personRadius,
        count: acc.count + cur.count,
      }));

    this.agentView.draw(allData);
  }

  _createIncrementals() {
    // return [new Bounds(0, 100, 0, 100), new Bounds(120, 220, 0, 100)];
    const listOfBounds = [];

    // Space between 2 models + 2 on the sides
    const oneModelWidth = Math.round(
      (this.width - 3 * SPACE_BETWEEN_COMMUNITIES) / this.numModels
    );

    // Space between each row (of two models) + 2 on the sides
    const oneModelHeight = Math.round(
      (this.height -
        Math.round(this.numModels / 2) * SPACE_BETWEEN_COMMUNITIES -
        2 * SPACE_BETWEEN_COMMUNITIES) /
        this.numModels
    );

    // Keep increasing x until exceeds width
    // reset x and increaes y and start over

    // ASSUME even number
    let idx = 0;
    let y = SPACE_BETWEEN_COMMUNITIES;
    while (idx < this.numModels) {
      let x = SPACE_BETWEEN_COMMUNITIES;
      for (let i = 0; i < 2; i++) {
        listOfBounds.push(
          new Bounds(x, x + oneModelWidth, y, y + oneModelHeight)
        );

        x += oneModelWidth + SPACE_BETWEEN_COMMUNITIES;
      }
      idx += 2;
      y += oneModelHeight + SPACE_BETWEEN_COMMUNITIES;
    }

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
    return listOfBounds;
  }

  setupCommunity() {
    const dividedStats = this._createDividedStats();
    const bounds = this._createIncrementals();

    for (let i = 0; i < this.numModels; i++) {
      this.communities[i] = new Model(
        i,
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

    this._setValuesFromStatsToLocal(stats);
    this.updateStats(stats);
  }

  resetCommunity(stats) {
    this._setValuesFromStatsToLocal(stats);

    const dividedStats = this._createDividedStats();
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
