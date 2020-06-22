/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

import wireSlidersToHandlers from './DOM/parameters';
import Community from './community';
import Stats from './data/stats';
import Bounds from './data/bounds';
import presetsManager from './presetsManager';
import RelocationUtil from './relocationUtil';
import {
  getTransmissionProbability,
  getAttractionToCenter,
  getRepulsionForce,
  getNonInToImmuneProb,
  getMinIncubationTime,
  getMaxIncubationTime,
  getMinInfectiousTime,
  getMaxInfectiousTime,
  getMinTimeUntilDead,
  getMaxTimeUntilDead,
  getInfectionRadius,
} from './DOM/domValues';
import { MAXIMUM_DAYS } from './CONSTANTS';
import { getRandom } from './util';

const {
  SPACE_BETWEEN_COMMUNITIES,
  DAYS_PER_SECOND,
} = presetsManager.loadPreset();

/** @class Model representing a simulation of one or multiple communities. */
export default class Model {
  /**
   * Instantiates a model.
   *
   * @param {number} numCommunities The number of communities in the model.
   * @param {Object} agentView The agentChart used to display the people.
   * @param {number} width The width of the model.
   * @param {number} height The height of the model.
   * @param {Stats} stats The stats object used by the model.
   * @param {function} updateStats A function to update the displayed stats and chart.
   */
  constructor(
    numCommunities,
    agentView,
    width,
    height,
    stats,
    updateStats,
    updateDemographicChart,
    updateTimeline,
    borderCtx
  ) {
    this.spaceBetweenCommunities = SPACE_BETWEEN_COMMUNITIES;
    this.numCommunities = numCommunities;
    this.communities = {};
    this.height = height;
    this.width = width;
    this.stats = stats;
    this.agentView = agentView;
    this.updateStats = updateStats;
    this.updateDemographicChart = updateDemographicChart;
    this.updateTimeline = updateTimeline;
    this.borderCtx = borderCtx;
    this.paused = false;
    this._chartInterval = null;

    this.timestamp = 0;
    this.daysPerSecond = DAYS_PER_SECOND;

    this.presetInProcess = false;

    this._mainLoopInterval = null;
    this.relocationUtil = new RelocationUtil(this);

    this._setValuesFromStatsToLocal(stats);

    // DEBUG
    window.model = this;
  }

  /**
   * A function that returns an array of the whole population in all models
   * @returns array containing all the population
   */
  getAllPopulation() {
    const allPopulation = [];
    Object.values(this.communities)
      .map((com) => com.population)
      .forEach((item) => {
        allPopulation.push(...item);
      });
    return allPopulation;
  }

  /**
   * A function to distribute the stats between the communitites
   * @param {Number} total the total number of people of a specific category (infectious, immune...).
   * @param {Number} index the index of the model being created.
   * @returns {Number} the number of people that should go in one box
   */
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

  /**
   * A function to create stats divided over the different communities.
   *
   * @param {number} index The index of the community.
   */
  _createDividedStats(index) {
    const valSus = this._distributeStats(this.numSusceptible, index);
    const valNonInf = this._distributeStats(this.numNonInfectious, index);
    const valInf = this._distributeStats(this.numInfectious, index);
    const valDead = this._distributeStats(this.numDead, index);
    const valImm = this._distributeStats(this.numImmune, index);
    const valIcu = this._distributeStats(this.numIcu, index);

    return new Stats(valSus, valNonInf, valInf, valDead, valImm, valIcu);
  }

  /**
   * A function to set the values of the model to those of a stats object.
   *
   * @param {Stats} stats The stats object with the desired values.
   */
  _setValuesFromStatsToLocal(stats) {
    this.numSusceptible = stats.susceptible;
    this.numInfectious = stats.infectious;
    this.numNonInfectious = stats.noninfectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
    this.numIcu = stats.icu;
  }

  /**
   * A function to register a person relocating within the model.
   *
   * @param {Person} person The person relocating.
   */
  registerRelocation(person) {
    this.relocationUtil.insertRelocation(person);
  }

  /**
   *
   * A function to populate each of the communities in the model.
   */
  populateCommunities() {
    for (let i = 0; i < this.numCommunities; i++) {
      this.communities[i].populateCanvas();
    }
  }

  /**
   * A function to reload the preset used by the model.
   */
  reloadPreset() {
    const {
      SPACE_BETWEEN_COMMUNITIES: NEW_SPACE_BETWEEN_COMMUNITIES,
    } = presetsManager.loadPreset();
    this.spaceBetweenCommunities = NEW_SPACE_BETWEEN_COMMUNITIES;
  }

  /**
   * A function to start execution of the model.
   */
  run() {
    require('seedrandom')('hi.', { global: true });
    wireSlidersToHandlers(this);
    this.populateCommunities();
    this.updateAgentSize(this.getAgentSize(this.stats.sum()));

    this._mainLoopInterval = setInterval(
      this._animationFunction.bind(this),
      50
    );
    this._chartInterval = setInterval(this.compileStats.bind(this), 500);
  }

  /**
   * A function to handle the animations for a certain timestamp.
   *
   * @param {number} timestamp The timestamp of the current moment.
   */
  _animationFunction() {
    if (this.timestamp > MAXIMUM_DAYS) {
      clearInterval(this._mainLoopInterval);
      clearInterval(this._chartInterval);
      return;
    }
    const dt = 0.05 * DAYS_PER_SECOND;
    this.timestamp += dt;
    this.passDrawInfoToAgentChart();
    Object.values(this.communities).forEach((com) => com.step(dt));
    // Check all relocations
    this.relocationUtil.handleAllRelocations();

    const stats = Object.values(this.communities)
      .map((m) => m.exportStats())
      .reduce(
        (acc, cur) =>
          new Stats(
            acc.susceptible + cur.susceptible,
            acc.noninfectious + cur.noninfectious,
            acc.infectious + cur.infectious,
            acc.dead + cur.dead,
            acc.immune + cur.immune,
            acc.icu + cur.icu
          )
      );

    const relocationStats = this.relocationUtil.getStats();
    const finalStats = Stats.joinStats(stats, relocationStats);

    this.updateTimeline(finalStats, this.timestamp);
    this.updateDemographicChart();
  }

  /**
   * A function to pause/unpause the model;
   */
  togglePause() {
    if (this.paused) {
      // Unpause
      this._mainLoopInterval = setInterval(
        this._animationFunction.bind(this),
        50
      );
      this._chartInterval = setInterval(this.compileStats.bind(this), 500);
    } else {
      // Pause
      clearInterval(this._mainLoopInterval);
      clearInterval(this._chartInterval);
    }
    this.paused = !this.paused;
  }

  /**
   * A function to pass all info to AgentChart to allow drawing the model.
   */
  passDrawInfoToAgentChart() {
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

  /**
   * A function to create a list of bounds of the communities in the model.
   *
   * @returns {Array{Bounds}} A list of bounds of the different communities.
   */
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
      (this.width - (widthFactor + 1) * this.spaceBetweenCommunities) /
        widthFactor
    );

    const oneCommunityHeight = Math.round(
      (this.height - (heightFactor + 1) * this.spaceBetweenCommunities) /
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
        currentX = this.spaceBetweenCommunities;
        currentY = nextY + this.spaceBetweenCommunities;
        nextY = currentY + oneCommunityHeight;
      }
      listOfBounds.push(
        new Bounds(currentX, currentX + oneCommunityWidth, currentY, nextY)
      );
      currentX += oneCommunityWidth;
      currentX += this.spaceBetweenCommunities;
    }

    return listOfBounds;
  }

  /**
   * A function to initialize all communities.
   */
  setupCommunity() {
    const { width, height } = this.borderCtx.canvas.getBoundingClientRect();
    this.borderCtx.clearRect(0, 0, width * 2, height * 2);
    const bounds = this._createIncrementals();

    for (let i = 0; i < this.numCommunities; i++) {
      const dividedStats = this._createDividedStats(i);

      this.communities[i] = new Community(
        i,
        bounds[i],
        dividedStats,
        this.registerRelocation.bind(this)
      );

      if (!this.presetInProcess) {
        this.updateTransmissionProb(getTransmissionProbability());
        this.updateAttractionToCenter(getAttractionToCenter());
        this.updateRepulsionForce(getRepulsionForce());
        this.updateNonInToImmuneProb(getNonInToImmuneProb());
        this.updateMinIncubationTime(getMinIncubationTime());
        this.updateMaxIncubationTime(getMaxIncubationTime());
        this.updateMinInfectiousTime(getMinInfectiousTime());
        this.updateMaxInfectiousTime(getMaxInfectiousTime());
        this.updateMinTimeUntilDead(getMinTimeUntilDead());
        this.updateMaxTimeUntilDead(getMaxTimeUntilDead());
        this.updateInfectionRadius(getInfectionRadius());
      }

      this.communities[i]._drawBorderLines(this.borderCtx);
    }
  }

  /**
   * A function to get the site an agent should be drawn with.
   *
   * @param {number} population The size of the population.
   */
  getAgentSize(population) {
    if (population > 2000) {
      return 1.5;
    } else if (population > 1000) {
      return 2.5;
    } else if (population > 600) {
      return 3.5;
    } else {
      return 5;
    }
  }

  /**
   * A function to combine the stats of all communities.
   */
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
            acc.immune + cur.immune,
            acc.icu + cur.icu
          )
      );

    const relocationStats = this.relocationUtil.getStats();
    const finalStats = Stats.joinStats(stats, relocationStats);

    let icuCapacity = 0;
    for (let i = 0; i < this.numCommunities; i++) {
      icuCapacity += this.communities[i].icuCapacity;
    }

    this._setValuesFromStatsToLocal(finalStats);
    this.updateStats(finalStats, this.timestamp, icuCapacity);
  }

  /**
   * A function to reset the model.
   *
   * @param {Stats} stats New initial stats.
   */
  resetModel(stats) {
    require('seedrandom')('hi.', { global: true });
    this._setValuesFromStatsToLocal(stats);
    this.relocationUtil.clearAllRelocationsForReset();
    this.timestamp = 0;
    for (let i = 0; i < this.numCommunities; i++) {
      const dividedStats = this._createDividedStats(i);

      this.communities[i].resetCommunity(dividedStats);
    }

    this.updateAgentSize(this.getAgentSize(stats.sum()));
  }

  // SLIDER HANDLER METHODS

  /**
   * A function to update the size of a person from the slider.
   *
   * @param {number} newValue The new size of a person in the model.
   */
  updateAgentSize(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setPersonRadius(newValue)
    );
  }

  /**
   * A function to update the infection radius of people from the slider.
   *
   * @param {number} newValue The new the infection radius of a person in the model.
   */
  updateInfectionRadius(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setInfectionRadius(newValue)
    );
  }

  /**
   * A function to update the minimum time from the Infectious to the Dead state in the model.
   *
   * @param {number} newValue The new time for the state transition.
   */
  updateMinTimeUntilDead(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMinTimeUntilDead(newValue)
    );
  }

  /**
   * A function to update the maximum time from the Infectious state to the Dead state in the model.
   *
   * @param {number} newValue the new time for the state transition.
   */
  updateMaxTimeUntilDead(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMaxTimeUntilDead(newValue)
    );
  }

  /**
   * A function to update the minimum time from the Infectious state to the Immune state in the model.
   *
   * @param {number} newValue the new time for the state transition.
   */
  updateMinInfectiousTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMinInfectiousTime(newValue)
    );
  }

  /**
   * A function to update the maximum time from the Infectious state to the Immune state in the model.
   *
   * @param {number} newValue the new time for the state transition.
   */
  updateMaxInfectiousTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMaxInfectiousTime(newValue)
    );
  }

  /**
   * A function to update the minimum time from the Non-Infectious state to the Infectious state in the model.
   *
   * @param {number} newValue the new time for the state transition.
   */
  updateMinIncubationTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMinIncubationTime(newValue)
    );
  }

  /**
   * A function to update the maximum time from the Non-Infectious state to the Infectious state in the model.
   *
   * @param {number} newValue the new time for the state transition.
   */
  updateMaxIncubationTime(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setMaxIncubationTime(newValue)
    );
  }

  /**
   * A function to update the probability of transmission in the model.
   *
   * @param {number} newValue the new probability of transmission in the model.
   */
  updateTransmissionProb(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setTransmissionProb(newValue)
    );
  }

  /**
   * A function to update the probability of a person moving from the Non-Infectious state to the Immmune state in the model.
   *
   * @param {number} newValue The new probability of the transition in the model.
   */
  updateNonInToImmuneProb(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setNonInToImmuneProb(newValue)
    );
  }

  /**
   * A function to update the force with which people repel each other in the model.
   *
   * @param {number} newValue The new repulsion force in the model.
   */
  updateRepulsionForce(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setRepulsionForce(newValue)
    );
  }

  /**
   * A function to update the force with which people are attracted to the center in the model.
   *
   * @param {number} newValue The new attraction to center in the model.
   */
  updateAttractionToCenter(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setAttractionToCenter(newValue)
    );
  }

  /**
   * A function to update the probability a person is tested positive in the model.
   *
   * @param {number} newValue The new probability.
   */
  updateTestedPositiveProbability(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setTestedPositiveProbability(newValue)
    );
  }

  /**
   * A function to update the factor with which the Infection radius is reduced when a person tests positive.
   *
   * @param {number} newValue The new factor.
   */
  updateInfectionRadiusReductionFactor(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setInfectionRadiusReductionFactor(newValue)
    );
  }

  /**
   * A function to update the probability a person moves to the ICU when tested positive.
   *
   * @param {number} newValue The new probability.
   */
  updateIcuProbability(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setIcuProbability(newValue)
    );
  }

  /**
   * A function to update the capacity of the ICU in all communities.
   *
   * @param {number} newValue The new ICU capacity.
   */
  updateIcuCapacity(newValue) {
    Object.values(this.communities).forEach((community) =>
      community.setIcuCapacity(newValue)
    );
  }
}
