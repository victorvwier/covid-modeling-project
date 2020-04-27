import {
  TIME_UNTIL_SYMPTOMS,
  TIME_UNTIL_DETECTION,
  INFECTION_RADIUS,
  ASYMPTOMATIC_PROB,
} from './CONSTANTS';

export function sliderValues(model) {
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      const timeUntilSymptomsHTML = document.getElementById('timeToSymptoms');
      timeUntilSymptomsHTML.value = TIME_UNTIL_SYMPTOMS;
      timeUntilSymptomsHTML.addEventListener('change', function (event) {
        model.setTimeUntilSymptoms = event.target.value;
      });
    },
    false
  );

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      const timeUntilDetectionHTML = document.getElementById(
        'timeUntilDetection'
      );
      timeUntilDetectionHTML.value = TIME_UNTIL_DETECTION;
      timeUntilDetectionHTML.addEventListener('change', function (event) {
        model.setTimeUntilDetection = event.target.value;
      });
    },
    false
  );

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      const infectionCircleRadiusHTML = document.getElementById(
        'infectionCircleRadius'
      );
      infectionCircleRadiusHTML.value = INFECTION_RADIUS;
      infectionCircleRadiusHTML.addEventListener('change', function (event) {
        model.setInfectionRadius = event.target.value;
      });
    },
    false
  );

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      const asymptomaticProbabilityHTML = document.getElementById(
        'asymptomaticProbability'
      );
      asymptomaticProbabilityHTML.value = ASYMPTOMATIC_PROB;
      asymptomaticProbabilityHTML.addEventListener('change', function (event) {
        model.setAsymptomaticProb = event.target.value;
      });
    },
    false
  );
}

export const a = 1;
