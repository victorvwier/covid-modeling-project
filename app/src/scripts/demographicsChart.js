import Chart from 'chart.js';
import { agesMin, agesMax } from './data/demographic';
import { GENDERS } from './CONSTANTS';

export default class DemographicsChart {
  /**
   * Constructor for the demograpgics chart
   * @param {Context} ctx the context of the canvas where the chart will be drawn
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.labels = agesMin.map((val, idx) => `${val} - ${agesMax[idx]}`);
    this.data = {};
    agesMin.forEach(
      (val, idx) =>
        (this.data[this._formatLabel(val, agesMax[idx])] = {
          male: 0,
          female: 0,
        })
    );

    console.log(this.data);
  }

  /**
   * Formates an age range label like: <min - max>
   * @param {Number} min min age
   * @param {Number} max max age
   * @returns formatted label
   */
  _formatLabel(min, max) {
    return `${min} - ${max}`;
  }

  /**
   * Gets the ranges from a formatted age range label
   * @param {Number} label age range label
   * @returns [min, max] two item array containing the min and max of that age range label
   */
  _getMinMaxFromLabel(label) {
    return label.split(' - ').map((item) => parseInt(item, 10));
  }

  _setupDataMaleFemale(population) {
    Object.keys(this.data).forEach((label) => {
      const [min, max] = this._getMinMaxFromLabel(label);
      // TODO check range <= and <
      const thisAgeRange = population.filter((p) => min < p.age <= max);
      const maleCount = thisAgeRange
        .filter((p) => (p.gender = GENDERS.MALE))
        .length();
      const femaleCount = thisAgeRange
        .filter((p) => (p.gender = GENDERS.FEMALE))
        .length();

      this.data[label].male = maleCount;
      this.data[label].female = femaleCount;
    });
  }

  /**
   * A function that draws the demographics chart given the population of the model
   * @param {Array.<Person>} population the population of all communities combined
   */
  drawChart(population) {
    // this._setupDataMaleFemale(population);
    return new Chart(this.ctx, {
      type: 'horizontalBar',

      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Female',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
            stack: 'a',
          },
          {
            label: 'Male',
            backgroundColor: 'rgb(2, 99, 132)',
            borderColor: 'rgb(2, 99, 132)',
            data: [-10, -110, -15, -12, -120, -130, -145],
            stack: 'b',
          },
        ],
      },

      // Configuration options go here
      options: {
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                callback: (value) => Math.abs(value),
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                callback: (value) => (value < 0 ? -value : value),
              },
            },
          ],
        },
      },
    });
  }
}
