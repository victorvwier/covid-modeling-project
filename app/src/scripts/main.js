import Stats from './data/stats';
import Model from './model';
import Chart from './chart';
import wireSlidersToHandlers, {
  wireReloadButtonToMain,
} from './DOM/parameters';
import {
  getInitialNumSymptomatic,
  getInitialNumSusceptable,
} from './DOM/domValues';

// Creates chart and graph internally
export default class Main {
  constructor(
    modelContext,
    chartContext,
    width,
    height,
    numSusceptible,
    numSymptomatic,
    numAsymptomatic,
    numDead,
    numImmune
  ) {
    // Canvas contexts of the graph and chart
    this.modelContext = modelContext;
    this.chartContext = chartContext;

    this.width = width;
    this.height = height;
    this.numSusceptible = numSusceptible;
    this.numSymptomatic = numSymptomatic;
    this.numImmune = numImmune;
    this.numDead = numDead;
    this.numAsymptomatic = numAsymptomatic;

    // Create chart and model (setup)
    this.chart = new Chart(this.chartContext);
    this.model = null;
    this.setupModel();

    // Wire reload button
    wireReloadButtonToMain(this);

    // DEBUG
    window.model = this.model;
    window.chart = this.chart;
  }

  createCurrentStats() {
    return new Stats(
      this.numSusceptible,
      this.numSymptomatic,
      this.numAsymptomatic,
      this.numDead,
      this.numImmune
    );
  }

  // Assume only model calls this one so update chart
  receiveNewStatsAndUpdateChart(stats) {
    this.numSusceptible = stats.susceptible;
    this.numSymptomatic = stats.symptomatic;
    this.numAsymptomatic = stats.asymptomatic;
    this.numImmune = stats.immune;
    this.numDead = stats.dead;

    this.chart.updateValues(this.createCurrentStats());
  }

  setupModel() {
    const stats = this.createCurrentStats();
    this.model = new Model(
      this.modelContext,
      this.width,
      this.height,
      stats,
      this.createCurrentStats.bind(this),
      this.receiveNewStatsAndUpdateChart.bind(this)
    );
  }

  run() {
    this.chart.drawChart();

    this.model.populateCanvas();
    this.model.drawPopulation();

    this.model.setup();
    this.model.loop();

    wireSlidersToHandlers(this.model);
  }

  reset() {
    this.numSusceptible = getInitialNumSusceptable();
    this.numSymptomatic = getInitialNumSymptomatic();
    this.numAsymptomatic = 0;
    this.numImmune = 0;
    this.numDead = 0;

    this.chart.resetChart(this.numSusceptible, this.numSymptomatic);
    this.model.resetModel(this.createCurrentStats());
  }
}
