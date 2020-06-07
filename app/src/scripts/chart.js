import ChartJS from 'chart.js';
import { COLORS } from './CONSTANTS';

/** @class Chart describing the line chart used to represent our data. */
export default class Chart {
  /**
   * Instantiates a Chart.
   *
   * @constructor
   * @param {Object} ctx The context in which the chart is displayed.
   * @param {function} getStats A function allowing us to retrieve a stats object which we want to graph.
   */
  constructor(ctx, getStats) {
    this.ctx = ctx;
    this.getStats = getStats;

    this.x = 1; // TODO use a timescale instead at some point
    this.chart = null;
    this.susceptible = [];
    this.noninfectious = [];
    this.infectious = [];
    this.immune = [];
    this.dead = [];
    this.xValues = [];
  }

  /**
   * A function getting the size of the total population represented in the chart.
   *
   * @returns {number} The size of the total population.
   */
  getTotalPopulation() {
    return this.getStats().sum();
  }

  /**
   * A function allowing us to reset the chart to a new starting state.
   *
   * @param {number} newInitSusceptible The initial amount of susceptible people.
   * @param {number} newInitInfectious The initial amount of infectious people.
   */
  resetChart(newInitSusceptible, newInitInfectious) {
    this.x = 1;
    this.susceptible = [newInitSusceptible];
    this.noninfectious = [];
    this.infectious = [newInitInfectious];
    this.immune = [];
    this.dead = [];
    this.xValues = [];
    this.chart.update();
    this.chart.destroy();
    this.drawChart();
  }

  /**
   * A function updating the values in the chart.
   *
   * @param {Stats} stats a stats object holding the new values.
   */
  updateValues(stats) {
    this.chart.data.datasets[0].data.push(stats.infectious);
    this.chart.data.datasets[1].data.push(stats.noninfectious);
    this.chart.data.datasets[2].data.push(stats.susceptible);
    this.chart.data.datasets[3].data.push(stats.immune);
    this.chart.data.datasets[4].data.push(stats.dead);

    this.susceptible.push(stats.susceptible);
    this.noninfectious.push(stats.noninfectious);
    this.infectious.push(stats.infectious);
    this.immune.push(stats.immune);
    this.dead.push(stats.dead);

    // What is x?
    this.chart.data.labels.push(this.x++);
    this.xValues.push(this.x - 1);
    this.chart.update();
  }

  /**
   * A function to initially draw the chart on the screen.
   */
  drawChart() {
    this.chart = new ChartJS(this.ctx, {
      type: 'line',
      data: {
        labels: this.xValues,
        datasets: [
          {
            label: 'Infectious',
            fill: true,
            backgroundColor: COLORS.INFECTIOUS,
            pointBackgroundColor: COLORS.INFECTIOUS,
            borderColor: COLORS.INFECTIOUS,
            pointHighlightStroke: COLORS.INFECTIOUS,
            borderCapStyle: 'square',
            lineCap: 'square',
            pointStyle: 'line',
            data: this.infectious,
          },
          {
            label: 'Non-Infectious',
            fill: true,
            backgroundColor: COLORS.NONINFECTIOUS,
            pointBackgroundColor: COLORS.NONINFECTIOUS,
            borderColor: COLORS.NONINFECTIOUS,
            pointHighlightStroke: COLORS.NONINFECTIOUS,
            borderCapStyle: 'square',
            lineCap: 'square',
            pointStyle: 'line',
            data: this.noninfectious,
          },
          {
            label: 'Susceptible',
            fill: true,
            backgroundColor: COLORS.SUSCEPTIBLE,
            pointBackgroundColor: COLORS.SUSCEPTIBLE,
            borderColor: COLORS.SUSCEPTIBLE,
            pointHighlightStroke: COLORS.SUSCEPTIBLE,
            borderCapStyle: 'square',
            lineCap: 'square',
            data: this.susceptible,
            pointStyle: 'line',
          },
          {
            label: 'Immune',
            fill: true,
            backgroundColor: COLORS.IMMUNE,
            pointBackgroundColor: COLORS.IMMUNE,
            borderColor: COLORS.IMMUNE,
            pointHighlightStroke: COLORS.IMMUNE,
            borderCapStyle: 'square',
            lineCap: 'square',
            pointStyle: 'line',
            data: this.immune,
          },
          {
            label: 'Dead',
            fill: true,
            backgroundColor: COLORS.DEAD,
            pointBackgroundColor: COLORS.DEAD,
            borderColor: COLORS.DEAD,
            pointHighlightStroke: COLORS.DEAD,
            borderCapStyle: 'square',
            lineCap: 'square',
            pointStyle: 'line',
            data: this.dead,
          },
        ],
      },
      options: {
        responsive: false,
        tooltips: { enabled: false },
        hover: { mode: null },
        // Can't just just `stacked: true` like the docs say
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: true,
                steps: this.getTotalPopulation() / 10, // Check if this is still nice
                stepValue: 5,
                // Get the grand total so that the chart is accurate
                // Round to the closest 50 so that the chart is elegant
                max: Math.round(this.getTotalPopulation() / 50) * 50,
              },
              stacked: true,
            },
          ],
        },
        animation: {
          duration: 500,
          easing: 'linear',
        },
      },
    });
  }
}
