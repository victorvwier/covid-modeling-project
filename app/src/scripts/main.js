import Stats from './data/stats';
import Model from './model';
import Chart from './chart';
import PdfDownloadService from './pdfDownloadService';
import AgentChart from './agentChart';
import {
  wireReloadButtonToMain,
  wireTimelineButtontoTimeline,
  wireReloadPresetToMain,
  wireDownloadDataToMain,
  wirePauseButtonToMain,
} from './DOM/parameters';
import DemographicsChart from './demographicsChart';

import {
  getInitialNumInfectious,
  getInitialNumSusceptible,
  updateTheStatistics,
  getNumCommunities,
} from './DOM/domValues';
import {Timeline} from './timeline';
import { TIMELINE_PARAMETERS } from './CONSTANTS';

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
   */
  constructor(
    context,
    chartContext,
    timelineCanvas,
    borderCtx,
    demographicsCtx,
    width,
    height,
    numSusceptible,
    numNonInfectious,
    numInfectious,
    numDead,
    numImmune
  ) {
    wireDownloadDataToMain(this);
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
    this.numCommunities = getNumCommunities();

    // Create chart and model (setup)
    this.chart = new Chart(
      this.chartContext,
      this.createCurrentStats.bind(this)
    );

    this.timeline = new Timeline(timelineCanvas, this.timelineCallback.bind(this));
    this.timeline.importPresetRules();
    wireTimelineButtontoTimeline(this.timeline);
    this.demographicsChart = new DemographicsChart(demographicsCtx);
    this.agentView = new AgentChart(context);
    this.model = null;
    this.setupMain();

    // Wire reload button
    wireReloadButtonToMain(this);
    wireReloadPresetToMain(this);
    wirePauseButtonToMain(this);

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

  /**
   * A callback for the timeline to set parameters in the model.
   * @param {TIMELINE_PARAMETERS} timelineParam
   * @param {*} value 
   */
  timelineCallback(timelineParam, value) {
    if(timelineParam === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
      this.model.updateRepulsionForce(value);
    }
    if(timelineParam === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
      this.model.updateAttractionToCenter(value);
    }
  }

  // Assume only model calls this one so update chart
  /**
   * A function to update the local stats and update the chart with them.
   *
   * @param {Stats} stats the new stats.
   */
  receiveNewStatsAndUpdateChart(stats, timestamp, icuCapacity) {
    this.numSusceptible = stats.susceptible;
    this.numNonInfectious = stats.noninfectious;
    this.numInfectious = stats.infectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;
    this.numIcu = stats.icu;

    this.chart.updateValues(this.createCurrentStats(), timestamp);
    this.timeline.update(stats, timestamp);
    updateTheStatistics(
      this.numSusceptible,
      this.numNonInfectious,
      this.numInfectious,
      this.numImmune,
      this.numDead,
      this.numIcu,
      icuCapacity
    );


  }

  updateDemographicChart() {
    const population = this.model.getAllPopulation();
    this.demographicsChart.receiveUpdate(population);
  }

  changePreset() {
    this.model.presetInProcess = true;
    this.model.reloadPreset();
    this.reset();
    this.model.presetInProcess = false;
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
    );
  }

  /**
   * A function to run the model and the chart.
   * 
   */
  run() {
    this.chart.drawChart();
    this.demographicsChart.drawChart(this.createCurrentStats().sum());
    this.model.setupCommunity();
    this.model.run();
  }

  /**
   * A function to pause/resume the model and the chart.
   */
  togglePause() {
    console.log("test");
    this.model.togglePause();
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

    this.model.resetModel(this.createCurrentStats());

    const {
      width1,
      height2,
    } = this.demographicsCtx.canvas.getBoundingClientRect();
    this.demographicsCtx.clearRect(0, 0, width1 * 2, height2 * 2);
    this.demographicsChart.resetChart(this.createCurrentStats().sum());
  }

  downloadPdf() {
    const data = this.chart.getAllDataPoints();
    PdfDownloadService.createDownloadPdf(data);
  }
}
