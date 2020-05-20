import ChartJS from 'chart.js';
import { COLORS } from './CONSTANTS';

export default class Chart {
  constructor(ctx, getStats) {
    this.ctx = ctx;
    this.getStats = getStats;

    this.x = 1; // TODO use a timescale instead at some point
    this.chart = null;
    this.susceptable = [];
    this.noninfectious = [];
    this.infectious = [];
    this.immune = [];
    this.dead = [];
    this.xValues = [];
  }

  getTotalPopulation() {
    return this.getStats().sum();
  }

  resetChart(newInitSusceptable, newInitInfectious) {
    this.x = 1;
    this.susceptable = [newInitSusceptable];
    this.noninfectious = [];
    this.infectious = [newInitInfectious];
    this.immune = [];
    this.dead = [];
    this.xValues = [];
    this.chart.update();
    this.chart.destroy();
    this.drawChart();
  }

  updateValues(stats) {
    this.chart.data.datasets[0].data.push(stats.susceptible);
    this.susceptable.push(stats.susceptible);
    this.chart.data.datasets[1].data.push(stats.noninfectious);
    this.noninfectious.push(stats.noninfectious);
    this.chart.data.datasets[2].data.push(stats.infectious);
    this.infectious.push(stats.infectious);
    this.chart.data.datasets[3].data.push(stats.immune);
    this.immune.push(stats.immune);
    this.chart.data.datasets[4].data.push(stats.dead);
    this.dead.push(stats.dead);
    // What is x?
    this.chart.data.labels.push(this.x++);
    this.xValues.push(this.x - 1);
    this.chart.update();
  }

  drawChart() {
    this.chart = new ChartJS(this.ctx, {
      type: 'line',
      data: {
        labels: this.xValues,
        datasets: [
          {
            label: 'Susceptable',
            fill: true,
            backgroundColor: COLORS.SUSCEPTIBLE,
            pointBackgroundColor: COLORS.SUSCEPTIBLE,
            borderColor: COLORS.SUSCEPTIBLE,
            pointHighlightStroke: COLORS.SUSCEPTIBLE,
            borderCapStyle: 'square',
            lineCap: 'square',
            data: this.susceptable,
            pointStyle: 'line',
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
          duration: 750,
        },
      },
    });
  }
}
