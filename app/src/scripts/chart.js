import ChartJS from 'chart.js';
import { COLORS } from './CONSTANTS';

export default class Chart {
  constructor(ctx) {
    this.x = 1;
    this.ctx = ctx;
    this.chart = null;
    this.susceptable = [];
    this.asymptomatic = [];
    this.symptomatic = [];
    this.immune = [];
    this.dead = [];
    this.xValues = [];
  }

  resetChart(newInitSusceptable, newInitSymptomatic) {
    this.x = 1;
    this.susceptable = [newInitSusceptable];
    this.asymptomatic = [];
    this.symptomatic = [newInitSymptomatic];
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
    this.chart.data.datasets[1].data.push(stats.asymptomatic);
    this.asymptomatic.push(stats.asymptomatic);
    this.chart.data.datasets[2].data.push(stats.symptomatic);
    this.symptomatic.push(stats.symptomatic);
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
            label: 'Asymptomatic',
            fill: true,
            backgroundColor: COLORS.ASYMPTOMATIC,
            pointBackgroundColor: COLORS.ASYMPTOMATIC,
            borderColor: COLORS.ASYMPTOMATIC,
            pointHighlightStroke: COLORS.ASYMPTOMATIC,
            borderCapStyle: 'square',
            lineCap: 'square',
            pointStyle: 'line',
            data: this.asymptomatic,
          },
          {
            label: 'Symptomatic',
            fill: true,
            backgroundColor: COLORS.SYMPTOMATIC,
            pointBackgroundColor: COLORS.SYMPTOMATIC,
            borderColor: COLORS.SYMPTOMATIC,
            pointHighlightStroke: COLORS.SYMPTOMATIC,
            borderCapStyle: 'square',
            lineCap: 'square',
            pointStyle: 'line',
            data: this.symptomatic,
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
        // Can't just just `stacked: true` like the docs say
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: 100,
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
