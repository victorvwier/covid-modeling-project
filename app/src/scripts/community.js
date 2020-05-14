import wireSlidersToHandlers from './DOM/parameters';
import Model from './model';
import Stats from './data/stats';
import Bounds from './data/bounds';
import Relocation from './data/relocation';
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
    // Space between each of the models + 2 on the sides
    let widthFactor = 1;
    let heightFactor = 1;
    if (this.numModels <= 6) {
      widthFactor = 2;
      heightFactor = Math.ceil(this.numModels / widthFactor);
    } else if (this.numModels <= 12) {
      widthFactor = 3;
      heightFactor = Math.ceil(this.numModels / widthFactor);
    }

    const oneModelWidth = Math.round(
      (this.width - (widthFactor + 1) * SPACE_BETWEEN_COMMUNITIES) / widthFactor
    );

    const oneModelHeight = Math.round(
      (this.height - (heightFactor + 1) * SPACE_BETWEEN_COMMUNITIES) /
        heightFactor
    );
    let currentX = 0;
    let currentY = 0;
    let nextY = 0;

    for (let i = 0; i < this.numModels; i++) {
      if (
        (this.numModels <= 6 && i % 2 === 0) ||
        (this.numModels <= 12 && this.numModels >= 7 && i % 3 === 0)
      ) {
        currentX = SPACE_BETWEEN_COMMUNITIES;
        currentY = nextY + SPACE_BETWEEN_COMMUNITIES;
        nextY = currentY + oneModelHeight;
      }
      listOfBounds.push(
        new Bounds(currentX, currentX + oneModelWidth, currentY, nextY)
      );
      currentX += oneModelWidth;
      currentX += SPACE_BETWEEN_COMMUNITIES;
    }

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

  // relocate(relocation) {
  //   let destination = Math.random(0, this.numModels - 1);
  //   while (destination === relocation.origin) {
  //     destination = Math.random(0, this.numModels - 1);
  //   }
  //   relocation.setDestination(destination);
  //   this.communities[destination].addPerson(relocation.person);
  // }

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
