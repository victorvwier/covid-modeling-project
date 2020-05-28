import Stats from './data/stats';
import Model from './model';
import Chart from './chart';
import AgentChart from './agentChart';
import { wireReloadButtonToMain } from './DOM/parameters';
import {
  getInitialNumInfectious,
  getInitialNumSusceptible,
  updateTheStatistics,
} from './DOM/domValues';

// Creates chart and graph internally
/** @class Main handling all seperate components of our program. */
export default class Main {
  
  /**
   * Creates an instance of the Main class.
   * 
   * @constructor
   * @param {Object} context The webGL context of our HTML.
   * @param {Object} chartContext The 2D context we use to draw our chart.
   * @param {number} width The width of our glCanvas.
   * @param {number} height The height of our glCanvas.
   * @param {number} numSusceptible The initial number of Susceptible people.
   * @param {*} numNonInfectious The initial number of Non-Infectious people.
   * @param {*} numInfectious The initial number of Infectious people.
   * @param {*} numDead The initial number of Dead people.
   * @param {*} numImmune The initial number of Immune people.
   */
  constructor(
    context,
    chartContext,
    width,
    height,
    numSusceptible,
    numNonInfectious,
    numInfectious,
    numDead,
    numImmune
  ) {
    // Canvas contexts of the graph and chart
    this.chartContext = chartContext;

    this.width = width;
    this.height = height;
    this.numSusceptible = numSusceptible;
    this.numInfectious = numInfectious;
    this.numImmune = numImmune;
    this.numDead = numDead;
    this.numNonInfectious = numNonInfectious;

    // Create chart and model (setup)
    this.chart = new Chart(
      this.chartContext,
      this.createCurrentStats.bind(this)
    );
    this.agentView = new AgentChart(context);
    this.model = null;
    this.setupMain();

    // Wire reload button
    wireReloadButtonToMain(this);

    // DEBUG
    window.chart = this.chart;
    window.main = this;
  }

  /**
   * A function to create a stats object with current stats.
   * 
   * @returns {Stats} A Stats object representing the current state.
   */
  createCurrentStats() {
    return new Stats(
      this.numSusceptible,
      this.numNonInfectious,
      this.numInfectious,
      this.numDead,
      this.numImmune
    );
  }

  // Assume only model calls this one so update chart
  /**
   * A function to update the local stats and update the chart with them.
   * 
   * @param {Stats} stats the new stats.
   */
  receiveNewStatsAndUpdateChart(stats) {
    this.numSusceptible = stats.susceptible;
    this.numNonInfectious = stats.noninfectious;
    this.numInfectious = stats.infectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;

    this.chart.updateValues(this.createCurrentStats());
    updateTheStatistics(
      this.numSusceptible,
      this.numNonInfectious,
      this.numInfectious,
      this.numImmune,
      this.numDead
    );
  }

  /**
   * A function to setup the main class.
   */
  setupMain() {
    const stats = this.createCurrentStats();
    console.log(stats);
    this.model = new Model(
      4, // TODO determine the number of communities
      this.agentView,
      this.width,
      this.height,
      stats,
      this.receiveNewStatsAndUpdateChart.bind(this)
    );
  }

  /**
   * A function to run the model and the chart.
   */
  run() {
    this.chart.drawChart();

    this.model.setupCommunity();
    this.model.run();
  }

  /**
   * A function to reset the model and the chart.
   */
  reset() {
    // Reset the stats
    this.numSusceptible = getInitialNumSusceptible();
    this.numInfectious = getInitialNumInfectious();
    this.numNonInfectious = 0;
    this.numImmune = 0;
    this.numDead = 0;

    this.chart.resetChart(this.numSusceptible, this.numInfectious);
    this.model.resetCommunity(this.createCurrentStats());
  }
}
