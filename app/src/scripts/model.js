import wireSlidersToHandlers from './DOM/parameters';
import Community from './community';
import Stats from './data/stats';
import Bounds from './data/bounds';
import { SPACE_BETWEEN_COMMUNITIES } from './CONSTANTS';
import RelocationUtil from './relocationUtil';

export default class Model {
  constructor(numCommunities, agentView, width, height, stats, updateStats) {
    this.numCommunities = numCommunities;
    this.communities = {};
    this.height = height;
    this.width = width;
    this.stats = stats;
    this.agentView = agentView;
    this.updateStats = updateStats;

    this._chartInterval = null;

    this.lastTimestamp = 0;

    this._passDrawInfoAnimationFrame = null;
    this.relocationUtil = new RelocationUtil(this);

    this._setValuesFromStatsToLocal(stats);

    // DEBUG
    window.community = this;
  }

  _distributeStats(total, index) {
    let itemsPerBucket = Math.floor(total / this.numCommunities);
    if (total < this.numCommunities) {
      itemsPerBucket = 0;
    }

    const remainingItems = total % this.numCommunities;
    const values = [];
    values[0] = 0;
    for (let i = 1; i <= this.numCommunities; i++) {
      let extra = 0;
      if (i <= remainingItems) {
        extra = 1;
      }
      values[i] = itemsPerBucket + extra;
    }
    return values[index + 1];
  }

  _createDividedStats(index) {
    const valSus = this._distributeStats(this.numSusceptible, index);
    const valNonInf = this._distributeStats(this.numNonInfectious, index);
    const valInf = this._distributeStats(this.numInfectious, index);
    const valDead = this._distributeStats(this.numDead, index);
    const valImm = this._distributeStats(this.numImmune, index);

    return new Stats(valSus, valNonInf, valInf, valDead, valImm);
  }

  _setValuesFromStatsToLocal(stats) {
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
  }

  registerRelocation(person) {
    this.relocationUtil.insertRelocation(person);
  }

  pauseExecution() {
    // Cancel animation frame
    cancelAnimationFrame(this._passDrawInfoAnimationFrame);
    this._passDrawInfoAnimationFrame = null;
    // clearInterval(this._chartInterval);
    // this._chartInterval = null;
    // Cancel all community intervals/animationFrames
    Object.values(this.communities).forEach((com) => com.pauseExecution());
  }

  resumeExecution() {
    // Resume animationFrame
    this._animationFunction();
    // if(this._chartInterval === null) {
    //   this._chartInterval = setInterval(this.compileStats.bind(this), 500);
    // }
    // Resume community intervals/animationFrames
    Object.values(this.communities).forEach((com) => com.resumeExecution());
  }

  populateCommunities() {
    for (let i = 0; i < this.numCommunities; i++) {
      this.communities[i].populateCanvas();
    }
  }

  run() {
    wireSlidersToHandlers(this);
    this.populateCommunities();

    this._animationFunction();
    this._chartInterval = setInterval(this.compileStats.bind(this), 500);
  }

  _animationFunction(timestamp) {
    let dt = 0;
    if (this.lastTimestamp && timestamp) {
      dt = timestamp - this.lastTimestamp;
    } // The time passed since running the last step.
    this.lastTimestamp = timestamp;

    this.passDrawInfoToAgentChart();
    Object.values(this.communities).forEach((mod) => mod.step(dt));
    // Check all relocations
    this.relocationUtil.handleAllRelocations();
  }

  passDrawInfoToAgentChart() {
    this._passDrawInfoAnimationFrame = requestAnimationFrame(
      this._animationFunction.bind(this)
    );

    const allData = Object.values(this.communities)
      .map((com) => com.getDrawInfo())
      .reduce((acc, cur) => ({
        positions: acc.positions.concat(cur.positions),
        colors: acc.colors.concat(cur.colors),
        size: this.communities[0].personRadius,
        count: acc.count + cur.count,
      }));

    // TODO remove this and refactor person to get his own drawInfo
    this.relocationUtil.relocations.forEach(({ person }) => {
      allData.positions.push(person.x);
      allData.positions.push(person.y);
      allData.colors.push(parseInt(person.color.slice(1, 3), 16) / 255.0);
      allData.colors.push(parseInt(person.color.slice(3, 5), 16) / 255.0);
      allData.colors.push(parseInt(person.color.slice(5, 7), 16) / 255.0);
      allData.colors.push(1);
      allData.count++;
    });
    this.agentView.draw(allData);
  }

  _createIncrementals() {
    // return [new Bounds(0, 100, 0, 100), new Bounds(120, 220, 0, 100)];
    const listOfBounds = [];
    // Space between each of the communities + 2 on the sides
    let widthFactor = 1;
    let heightFactor = 1;
    if (this.numCommunities === 1) {
      widthFactor = 1;
      heightFactor = 1;
    } else if (this.numCommunities <= 6) {
      widthFactor = 2;
      heightFactor = Math.ceil(this.numCommunities / widthFactor);
    } else if (this.numCommunities <= 12) {
      widthFactor = 3;
      heightFactor = Math.ceil(this.numCommunities / widthFactor);
    }

    const oneCommunityWidth = Math.round(
      (this.width - (widthFactor + 1) * SPACE_BETWEEN_COMMUNITIES) / widthFactor
    );

    const oneCommunityHeight = Math.round(
      (this.height - (heightFactor + 1) * SPACE_BETWEEN_COMMUNITIES) /
        heightFactor
    );
    let currentX = 0;
    let currentY = 0;
    let nextY = 0;

    for (let i = 0; i < this.numCommunities; i++) {
      if (
        (this.numCommunities <= 6 && i % 2 === 0) ||
        (this.numCommunities <= 12 && this.numCommunities >= 7 && i % 3 === 0)
      ) {
        currentX = SPACE_BETWEEN_COMMUNITIES;
        currentY = nextY + SPACE_BETWEEN_COMMUNITIES;
        nextY = currentY + oneCommunityHeight;
      }
      listOfBounds.push(
        new Bounds(currentX, currentX + oneCommunityWidth, currentY, nextY)
      );
      currentX += oneCommunityWidth;
      currentX += SPACE_BETWEEN_COMMUNITIES;
    }

    return listOfBounds;
  }

  setupCommunity() {
    const bounds = this._createIncrementals();

    for (let i = 0; i < this.numCommunities; i++) {
      const dividedStats = this._createDividedStats(i);

      this.communities[i] = new Community(
        i,
        bounds[i],
        dividedStats,
        this.registerRelocation.bind(this)
      );

      // DEBUG
      window.model = this;
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

    const relocationStats = this.relocationUtil.getStats();
    const finalStats = Stats.joinStats(stats, relocationStats);

    this._setValuesFromStatsToLocal(finalStats);
    this.updateStats(finalStats);
  }

  resetModel(stats) {
    this._setValuesFromStatsToLocal(stats);
    this.relocationUtil.clearAllRelocationsForReset();

    for (let i = 0; i < this.numModels; i++) {
      const dividedStats = this._createDividedStats(i);

      this.communities[i].resetCommunity(dividedStats);
    }
  }

  // SLIDER HANDLER METHODS

  updateAgentSize(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setPersonRadius(newValue)
    );
  }

  updateInfectionRadius(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setInfectionRadius(newValue)
    );
  }

  updateMinTimeUntilDead(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMinTimeUntilDead(newValue)
    );
  }

  updateMaxTimeUntilDead(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMaxTimeUntilDead(newValue)
    );
  }

  updateMinInfectiousTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMinInfectiousTime(newValue)
    );
  }

  updateMaxInfectiousTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMaxInfectiousTime(newValue)
    );
  }

  updateMinIncubationTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMinIncubationTime(newValue)
    );
  }

  updateMaxIncubationTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMaxIncubationTime(newValue)
    );
  }

  updateTransmissionProb(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setTransmissionProb(newValue)
    );
  }

  updateNonInToImmuneProb(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setNonInToImmuneProb(newValue)
    );
  }

  updateRepulsionForce(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setRepulsionForce(newValue)
    );
  }

  updateAttractionToCenter(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setAttractionToCenter(newValue)
    );
  }
}
