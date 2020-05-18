import {
  TRANSMISSION_PROB,
  NONIN_TO_IMMUNE_PROB,
  MIN_INCUBATION_TIME,
  MAX_INCUBATION_TIME,
  INFECTION_RADIUS,
  PERSON_RADIUS,
  INITAL_INFECTIOUS,
  INITIAL_SUSCEPTABLE,
  MIN_INFECTIOUS_TIME,
  MAX_INFECTIOUS_TIME,
  MIN_TIME_UNTIL_DEAD,
  MAX_TIME_UNTIL_DEAD,
  REPULSION_FORCE,
  ATTRACTION_FORCE,
} from '../CONSTANTS';

// The outValOp is for percentages, we can pass a function that will multiply a fraction by 100 for displaying to user
// Otherwise the default is just a function that returns the variable itself
function wireInput(
  inputId,
  outputId,
  initial,
  suffix,
  setter,
  outValOp = (x) => x
) {
  // TimeToSymptoms
  const inputHtml = document.getElementById(inputId);
  const outputHtml = document.getElementById(outputId);
  inputHtml.value = initial;
  outputHtml.value = `${outValOp(initial)} ${suffix}`;
  inputHtml.addEventListener('change', (e) => {
    const newVal = parseFloat(e.target.value);
    setter(newVal);
    outputHtml.value = `${outValOp(newVal)} ${suffix}`;
  });
}

export default function (model) {
  // TimeToSymptoms
  wireInput(
    'transmissionProb',
    'transmissionProbOut',
    TRANSMISSION_PROB,
    '%',
    model.setTransmissionProb.bind(model),
    (x) => x * 100
  );

  wireInput(
    'nonInToImmuneProb',
    'nonInToImmuneProbOut',
    NONIN_TO_IMMUNE_PROB,
    '%',
    model.setNonInToImmuneProb.bind(model),
    (x) => x * 100
  );

  // timeUntilImmune
  wireInput(
    'minIncubationTime',
    'minIncubationTimeOut',
    MIN_INCUBATION_TIME,
    'days',
    model.setMinIncubationTime.bind(model)
  );

  // timeUntilImmune
  wireInput(
    'maxIncubationTime',
    'maxIncubationTimeOut',
    MAX_INCUBATION_TIME,
    'days',
    model.setMaxIncubationTime.bind(model)
  );

  wireInput(
    'minInfectiousTime',
    'minInfectiousTimeOut',
    MIN_INFECTIOUS_TIME,
    'days',
    model.setMinInfectiousTime.bind(model)
  );

  // timeUntilImmune
  wireInput(
    'maxInfectiousTime',
    'maxInfectiousTimeOut',
    MAX_INFECTIOUS_TIME,
    'days',
    model.setMaxInfectiousTime.bind(model)
  );

  wireInput(
    'minTimeUntilDead',
    'minTimeUntilDeadOut',
    MIN_TIME_UNTIL_DEAD,
    'days',
    model.setMinTimeUntilDead.bind(model)
  );

  // timeUntilImmune
  wireInput(
    'maxTimeUntilDead',
    'maxTimeUntilDeadOut',
    MAX_TIME_UNTIL_DEAD,
    'days',
    model.setMaxTimeUntilDead.bind(model)
  );

  // Infection radius
  wireInput(
    'infectionCircleRadius',
    'infectionRadiusOut',
    INFECTION_RADIUS,
    'people',
    model.setInfectionRadius.bind(model)
  );

  // agentRadius
  wireInput(
    'agentRadius',
    'agentRadiusOut',
    PERSON_RADIUS,
    '',
    model.setPersonRadius.bind(model)
  );

  // agentRadius
  wireInput(
    'repulsionForce',
    'repulsionForceOut',
    REPULSION_FORCE,
    '%',
    model.setRepulsionForce.bind(model),
    (x) => x * 100
  );

  wireInput(
    'attractionForce',
    'attractionForceOut',
    ATTRACTION_FORCE,
    '%',
    model.setAttractionToCenter.bind(model),
    (x) => x * 100
  );

  // initial number of susceptibles

  wireInput(
    'initSusceptable',
    'initSusceptableCount',
    INITIAL_SUSCEPTABLE,
    '',
    (x) => x // Don't need a setter
  );

  // initial number of infected
  wireInput(
    'initInfectious',
    'initInfectiousCount',
    INITAL_INFECTIOUS,
    '',
    (x) => x // Don't need a setter
  );
}

export function wireReloadButtonToMain(main) {
  // Reset button
  document
    .getElementById('reload')
    .addEventListener('click', () => main.reset());
}
