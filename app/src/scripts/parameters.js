import {
  TIME_UNTIL_SYMPTOMS,
  TIME_UNTIL_DETECTION,
  INFECTION_RADIUS,
  ASYMPTOMATIC_PROB,
  PERSON_RADIUS,
} from './CONSTANTS';

export function wireSlidersToHandlers(model) {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      // TimeToSymptoms
      const timeUntilSymptomsHTML = document.getElementById('timeToSymptoms');
      const timeUntilSymptomsOutputHTML = document.getElementById(
        'timeToSymptomsOut'
      );
      timeUntilSymptomsHTML.value = TIME_UNTIL_SYMPTOMS;
      timeUntilSymptomsOutputHTML.value = `${TIME_UNTIL_SYMPTOMS} days`;
      timeUntilSymptomsHTML.addEventListener('change', (e) => {
        const newVal = e.target.value;
        model.setTimeUntilSymptoms = newVal;
        timeUntilSymptomsOutputHTML.value = `${newVal} days`;
      });

      // timeUntilDetection
      const timeUntilDetectionHTML = document.getElementById(
        'timeUntilDetection'
      );
      const timeUntilDetectionOutputHTML = document.getElementById(
        'timeUntilDetectionOut'
      );
      timeUntilDetectionHTML.value = TIME_UNTIL_DETECTION;
      timeUntilDetectionOutputHTML.value = `${TIME_UNTIL_DETECTION} days`;
      timeUntilDetectionHTML.addEventListener('change', (e) => {
        const newVal = e.target.value;
        model.setTimeUntilDetection = newVal;
        timeUntilDetectionOutputHTML.value = `${newVal} days`;
      });

      // infectionCircleRadius
      const infectionCircleRadiusHTML = document.getElementById(
        'infectionCircleRadius'
      );
      const infectionRadiusOutoputHTML = document.getElementById(
        'infectionRadiusOut'
      );
      infectionCircleRadiusHTML.value = INFECTION_RADIUS;
      infectionRadiusOutoputHTML.value = `${INFECTION_RADIUS} people`;

      infectionCircleRadiusHTML.addEventListener('change', (e) => {
        const newVal = e.target.value;
        model.setInfectionRadius = newVal;
        infectionRadiusOutoputHTML.value = newVal;
      });

      // asymptomaticProbability
      const asymptomaticProbabilityHTML = document.getElementById(
        'asymptomaticProbability'
      );
      const asymptomaticProbabilityOutputHTML = document.getElementById(
        'asymptomaticProbabilityOut'
      );
      asymptomaticProbabilityHTML.value = ASYMPTOMATIC_PROB;
      asymptomaticProbabilityOutputHTML.value = `${ASYMPTOMATIC_PROB * 100}%`;
      asymptomaticProbabilityHTML.addEventListener('change', (e) => {
        const newVal = e.target.value;
        model.setAsymptomaticProb = newVal;
        asymptomaticProbabilityOutputHTML.value = `${newVal * 100}%`;
      });

      // agentRadius
      const agentRadiusHTML = document.getElementById('agentRadius');
      const agentRadiusOutHTML = document.getElementById('agentRadiusOut');
      agentRadiusHTML.value = PERSON_RADIUS;
      agentRadiusOutHTML.value = PERSON_RADIUS;
      agentRadiusHTML.addEventListener('change', (e) => {
        const newVal = e.target.value;
        model.setPersonRadius = newVal;
        agentRadiusOutHTML.value = newVal;
      });

      // number of susceptibles
      // const initSusceptibleCountHTML = document.getElementById(
      //   'initSusceptibleCount'
      // );
      // initSusceptibleCountHTML.value = INITIAL_SUSCEPTABLE;
      // initSusceptibleCountHTML.addEventListener(
      //   'change',
      //   (event) => (model.setInitialSusceptable = event.target.value)
      // );

      // Reset button
      document
        .getElementById('reload')
        .addEventListener('click', () => model.resetModel());
    },
    false
  );
}

export const a = 1;
