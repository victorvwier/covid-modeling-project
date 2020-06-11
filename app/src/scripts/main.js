import Stats from './data/stats';
import Model from './model';
import Chart from './chart';
import AgentChart from './agentChart';
import { wireReloadButtonToMain } from './DOM/parameters';
import DemographicsChart from './demographicsChart';
import {
  getInitialNumInfectious,
  getInitialNumSusceptible,
  updateTheStatistics,
  getNumCommunities,
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
   * @param {Object} borderCtx The 2D context we use to draw the borders around our commuinities.
   * @param {Object} demographicsCtx The 2D context we use to draw our demographics chart.
   * @param {number} width The width of our glCanvas.
   * @param {number} height The height of our glCanvas.
   * @param {number} numSusceptible The initial number of Susceptible people.
   * @param {number} numNonInfectious The initial number of Non-Infectious people.
   * @param {number} numInfectious The initial number of Infectious people.
   * @param {number} numDead The initial number of Dead people.
   * @param {number} numImmune The initial number of Immune people.
   * @param {HTMLElement} icuDIV It is the div element whose color is changed as icu start filling up with patients.
   */
  constructor(
    context,
    chartContext,
    borderCtx,
    demographicsCtx,
    width,
    height,
    numSusceptible,
    numNonInfectious,
    numInfectious,
    numDead,
    numImmune,icuDIV
  ) {
    // Canvas contexts of the graph and chart
    this.chartContext = chartContext;
    this.borderCtx = borderCtx;
    this.demographicsCtx = demographicsCtx;
    this.width = width;
    this.height = height;
    this.numSusceptible = numSusceptible;
    this.numInfectious = numInfectious;
    this.numImmune = numImmune;
    this.numDead = numDead;
    this.numNonInfectious = numNonInfectious;
    this.numIcu = 0;
    this.icuDIV=icuDIV;

    this.numCommunities = getNumCommunities();

    // Create chart and model (setup)
    this.chart = new Chart(
      this.chartContext,
      this.createCurrentStats.bind(this)
    );
    this.demographicsChart = new DemographicsChart(demographicsCtx);
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
      this.numImmune,
      this.numIcu
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
    this.numIcu = stats.icu;

    this.chart.updateValues(this.createCurrentStats());
    updateTheStatistics(
      this.numSusceptible,
      this.numNonInfectious,
      this.numInfectious,
      this.numImmune,
      this.numDead,
      this.numIcu
    );


  }

  updateDemographicChart() {
    const population = this.model.getAllPopulation();
    this.demographicsChart.receiveUpdate(population);
  }

  /**
   * A function to setup the main class.
   */
  setupMain() {
    const stats = this.createCurrentStats();
    this.model = new Model(
      this.numCommunities, // TODO determine the number of communities
      this.agentView,
      this.width,
      this.height,
      stats,
      this.receiveNewStatsAndUpdateChart.bind(this),
      this.updateDemographicChart.bind(this),
      this.borderCtx,
      this.icuDIV
    );
  }

  /**
   * A function to run the model and the chart.
   */
  run() {
    this.chart.drawChart();
    this.demographicsChart.drawChart(this.createCurrentStats().sum());
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
    this.numIcu = 0;

    // Clear the border context
    const { width, height } = this.borderCtx.canvas.getBoundingClientRect();
    this.borderCtx.clearRect(0, 0, width * 2, height * 2);

    this.numCommunities = getNumCommunities();
    if (this.numCommunities !== this.model.numCommunities) {
      this.model.numCommunities = this.numCommunities;
    }

    this.model.communities = {};
    this.model.setupCommunity();

    this.chart.resetChart(this.numSusceptible, this.numInfectious);
    this.demographicsChart.resetChart(this.createCurrentStats().sum());
    this.model.resetModel(this.createCurrentStats());
  }
}
