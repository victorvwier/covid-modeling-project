import ChartJS from 'chart.js';
import { COLORS } from './CONSTANTS';

export default class Chart {
  constructor(ctx) {
    this.x = 1;
    this.ctx = ctx;
    this.chart = null;
    this.susceptable = [];
    this.asymptomatic = [];
    this.infected = [];
    this.immune = [];
    this.dead = [];
    this.xValues = [];
  }

  updateValues(newSusceptable, newAsymptotic, newInfected, newImmune, newDead) {
    this.chart.data.datasets[0].data.push(newSusceptable);
    this.susceptable.push(newSusceptable);
    this.chart.data.datasets[1].data.push(newAsymptotic);
    this.asymptomatic.push(newAsymptotic);
    this.chart.data.datasets[2].data.push(newInfected);
    this.infected.push(newInfected);
    this.chart.data.datasets[3].data.push(newImmune);
    this.immune.push(newImmune);
    this.chart.data.datasets[4].data.push(newDead);
    this.dead.push(newDead);
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
            label: 'Infected',
            fill: true,
            backgroundColor: COLORS.INFECTED,
            pointBackgroundColor: COLORS.INFECTED,
            borderColor: COLORS.INFECTED,
            pointHighlightStroke: COLORS.INFECTED,
            borderCapStyle: 'square',
            lineCap: 'square',
            pointStyle: 'line',
            data: this.infected,
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
