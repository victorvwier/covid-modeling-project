import Chart from 'chart.js';
import { GENDERS, AGE } from './CONSTANTS';

export default class DemographicsChart {
  /**
   * Constructor for the demograpgics chart
   * @param {Context} ctx the context of the canvas where the chart will be drawn
   */
  constructor(ctx) {
    this.demographicChart = null;
    this.ctx = ctx;
    this.labels = AGE.map((val) => this._formatLabel(val.min, val.max));

    // data
    this.maleData = new Array(AGE.length).fill(0);
    this.femaleData = new Array(AGE.length).fill(0);

    // DEBUG
    window.demographic = this;
  }

  recieveUpdate(population) {
    // Do logic
    // num dead per age per gender
    let index = 0;
    this.labels.forEach((label) => {
      const [min, max] = this._getMinMaxFromLabel(label);

      // Get the dead people of this age range
      const deadPeopleInAgeRange = population
        .filter((p) => p.isDead())
        .filter((p) => min <= p.age && p.age <= max);

      // const maleCount = deadPeopleInAgeRange.filter(
      //   (p) => p.gender === GENDERS.MALE
      // ).length;

      let maleCount = 0;
      let femaleCount = 0;

      for (let i = 0; i < deadPeopleInAgeRange.length; i++) {
        if (deadPeopleInAgeRange[i].gender === GENDERS.MALE) {
          maleCount++;
        } else {
          femaleCount++;
        }
      }

      this.maleData[index] = -maleCount;
      this.femaleData[index] = femaleCount;

      this.demographicChart.data.datasets[0].data[index] = -maleCount;
      this.demographicChart.data.datasets[1].data[index] = femaleCount;
      index++;
    });
    this.demographicChart.update();
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

  resetChart(populationSize) {
    this.demographicChart.destroy();
    this.maleData = new Array(this.maleData.length).fill(0);
    this.femaleData = new Array(this.femaleData.length).fill(0);
    this.drawChart(populationSize);
  }

  /**
   * A function that draws the demographics chart given the population of the model
   * @param {Array.<Person>} population the population of all communities combined
   */
  drawChart(populationSize) {
    const onePercent =
      Math.ceil(Math.round((populationSize * 0.5) / 100) / 10) * 10;
    this.demographicChart = new Chart(this.ctx, {
      type: 'horizontalBar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Male',
            backgroundColor: 'rgb(2, 99, 132)',
            borderColor: 'rgb(2, 99, 132)',
            data: this.maleData,
            // data: Object.values(this.data).map((item) => -item.male),
            stack: 'a',
          },

          {
            label: 'Female',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: this.femaleData,
            // data: Object.values(this.data).map((item) => item.female),
            stack: 'a',
          },
        ],
      },

      // Configuration options go here
      options: {
        title: {
          display: true,
          text: 'Mortality rate',
          position: 'bottom',
          fontSize: 24,
        },
        responsive: false,
        tooltips: { enabled: false },
        hover: { mode: null },
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                stepValue: 5,
                max: onePercent,
                min: -onePercent,
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
