import Stats from './data/stats';
import Community from './community';
import Chart from './chart';
import AgentChart from './agentChart';
import { wireReloadButtonToMain } from './DOM/parameters';
import {
  getInitialNumInfectious,
  getInitialNumSusceptable,
} from './DOM/domValues';

// Creates chart and graph internally
export default class Main {
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
    this.community = null;
    this.setupCommunity();

    // Wire reload button
    wireReloadButtonToMain(this);

    // DEBUG
    window.chart = this.chart;
    window.main = this;
  }

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
  receiveNewStatsAndUpdateChart(stats) {
    this.numSusceptible = stats.susceptible;
    this.numNonInfectious = stats.noninfectious;
    this.numInfectious = stats.infectious;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;

    this.chart.updateValues(this.createCurrentStats());
  }

  setupCommunity() {
    const stats = this.createCurrentStats();
    this.community = new Community(
      4, // TODO determine the number of communities
      this.agentView,
      this.width,
      this.height,
      stats,
      this.receiveNewStatsAndUpdateChart.bind(this)
    );
  }

  run() {
    this.chart.drawChart();

    this.community.setupCommunity();
    this.community.run();
  }

  reset() {
    this.numSusceptible = getInitialNumSusceptable();
    this.numInfectious = getInitialNumInfectious();
    this.numNonInfectious = 0;
    this.numImmune = 0;
    this.numDead = 0;

    this.chart.resetChart(this.numSusceptible, this.numInfectious);
    this.community.resetCommunity(this.createCurrentStats());
  }
}
