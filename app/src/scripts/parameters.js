import {
  TIME_UNTIL_SYMPTOMS,
  TIME_UNTIL_DETECTION,
  INFECTION_RADIUS,
  ASYMPTOMATIC_PROB,
} from './CONSTANTS';

export function wireSlidersToHandlers(model) {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      // TimeToSymptoms
      const timeUntilSymptomsHTML = document.getElementById('timeToSymptoms');
      timeUntilSymptomsHTML.value = TIME_UNTIL_SYMPTOMS;
      timeUntilSymptomsHTML.addEventListener(
        'change',
        (e) => (model.setTimeUntilSymptoms = e.target.value)
      );

      // timeUntilDetection
      const timeUntilDetectionHTML = document.getElementById(
        'timeUntilDetection'
      );
      timeUntilDetectionHTML.value = TIME_UNTIL_DETECTION;
      timeUntilDetectionHTML.addEventListener(
        'change',
        (e) => (model.setTimeUntilDetection = e.target.value)
      );

      // infectionCircleRadius
      const infectionCircleRadiusHTML = document.getElementById(
        'infectionCircleRadius'
      );
      infectionCircleRadiusHTML.value = INFECTION_RADIUS;
      infectionCircleRadiusHTML.addEventListener(
        'change',
        (e) => (model.setInfectionRadius = e.target.value)
      );

      // asymptomaticProbability
      const asymptomaticProbabilityHTML = document.getElementById(
        'asymptomaticProbability'
      );
      asymptomaticProbabilityHTML.value = ASYMPTOMATIC_PROB;
      asymptomaticProbabilityHTML.addEventListener(
        'change',
        (event) => (model.setAsymptomaticProb = event.target.value)
      );

      // Reset button
      document
        .getElementById('reload')
        .addEventListener('click', () => model.resetModel());
    },
    false
  );
}

export const a = 1;
