import {
  TIME_UNTIL_SYMPTOMS,
  TIME_UNTIL_IMMUNE,
  INFECTION_RADIUS,
  ASYMPTOMATIC_PROB,
  PERSON_RADIUS,
  INITIAL_SUSCEPTABLE,
  INITIAL_SYMPTOMATIC,
} from './CONSTANTS';

export function wireSlidersToHandlers(model) {
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

  // timeUntilImmune
  const timeUntilImmuneHTML = document.getElementById('timeUntilImmune');
  const timeUntilImmuneOutputHTML = document.getElementById(
    'timeUntilImmuneOut'
  );
  timeUntilImmuneHTML.value = TIME_UNTIL_IMMUNE;
  timeUntilImmuneOutputHTML.value = `${TIME_UNTIL_IMMUNE} days`;
  timeUntilImmuneHTML.addEventListener('change', (e) => {
    const newVal = e.target.value;
    model.setTimeUntilImmune = newVal;
    timeUntilImmuneOutputHTML.value = `${newVal} days`;
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

  // initial number of susceptibles
  const initSusceptibleHTML = document.getElementById('initSusceptable');
  const initSusceptibleOutputHTML = document.getElementById(
    'initSusceptableCount'
  );
  initSusceptibleHTML.value = INITIAL_SUSCEPTABLE;
  initSusceptibleOutputHTML.value = INITIAL_SUSCEPTABLE;
  initSusceptibleHTML.addEventListener('change', (e) => {
    const newVal = e.target.value;
    model.setInitialSusceptable = newVal;
    initSusceptibleOutputHTML.value = newVal;
  });

  // initial number of infected
  const initSymptomaticHTML = document.getElementById('initSymptomatic');
  const initSymptomaticOutputHTML = document.getElementById(
    'initSymptomaticCount'
  );
  initSymptomaticHTML.value = INITIAL_SYMPTOMATIC;
  initSymptomaticOutputHTML.value = INITIAL_SYMPTOMATIC;
  initSymptomaticHTML.addEventListener('change', (e) => {
    const newVal = e.target.value;
    model.setInitialSymptomatic = newVal;
    initSymptomaticOutputHTML.value = newVal;
  });

  // Reset button
  document
    .getElementById('reload')
    .addEventListener('click', () => model.resetModel());
}

export function getInitialNumSusceptable() {
  return parseInt(document.getElementById('initSusceptableCount').value, 10);
}

export function getInitialNumSymptomatic() {
  return parseInt(document.getElementById('initSymptomaticCount').value, 10);
}
