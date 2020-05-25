import {
  TRANSMISSION_PROB,
  NONIN_TO_IMMUNE_PROB,
  MIN_INCUBATION_TIME,
  MAX_INCUBATION_TIME,
  INFECTION_RADIUS,
  // PERSON_RADIUS,
  INITAL_INFECTIOUS,
  INITIAL_SUSCEPTIBLE,
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

export default function (community) {
  // TimeToSymptoms
  wireInput(
    'transmissionProb',
    'transmissionProbOut',
    TRANSMISSION_PROB,
    '%',
    community.updateTransmissionProb.bind(community),
    (x) => x * 100
  );
  wireInput(
    'nonInToImmuneProb',
    'nonInToImmuneProbOut',
    NONIN_TO_IMMUNE_PROB,
    '%',
    community.updateNonInToImmuneProb.bind(community),
    (x) => x * 100
  );

  // timeUntilImmune
  wireInput(
    'minIncubationTime',
    'minIncubationTimeOut',
    MIN_INCUBATION_TIME,
    'days',
    community.updateMinIncubationTime.bind(community)
  );
  // timeUntilImmune
  wireInput(
    'maxIncubationTime',
    'maxIncubationTimeOut',
    MAX_INCUBATION_TIME,
    'days',
    community.updateMaxIncubationTime.bind(community)
  );
  wireInput(
    'minInfectiousTime',
    'minInfectiousTimeOut',
    MIN_INFECTIOUS_TIME,
    'days',
    community.updateMinInfectiousTime.bind(community)
  );
  // timeUntilImmune
  wireInput(
    'maxInfectiousTime',
    'maxInfectiousTimeOut',
    MAX_INFECTIOUS_TIME,
    'days',
    community.updateMaxInfectiousTime.bind(community)
  );
  wireInput(
    'minTimeUntilDead',
    'minTimeUntilDeadOut',
    MIN_TIME_UNTIL_DEAD,
    'days',
    community.updateMinTimeUntilDead.bind(community)
  );
  // timeUntilImmune
  wireInput(
    'maxTimeUntilDead',
    'maxTimeUntilDeadOut',
    MAX_TIME_UNTIL_DEAD,
    'days',
    community.updateMaxTimeUntilDead.bind(community)
  );
  // Infection radius
  wireInput(
    'infectionCircleRadius',
    'infectionRadiusOut',
    INFECTION_RADIUS,
    'people',
    community.updateInfectionRadius.bind(community)
  );

  // const PERSON_RADIUS=5
  // agentRadius
  // wireInput(
  //   'agentRadius',
  //   'agentRadiusOut',
  //   PERSON_RADIUS,
  //   '',
  //   community.updateAgentSize.bind(community)
  // );

  // agentRadius
  wireInput(
    'repulsionForce',
    'repulsionForceOut',
    REPULSION_FORCE,
    '%',
    community.updateRepulsionForce.bind(community),
    (x) => x * 100
  );

  wireInput(
    'attractionForce',
    'attractionForceOut',
    ATTRACTION_FORCE,
    '%',
    community.updateAttractionToCenter.bind(community),
    (x) => x * 100
  );

  // initial number of susceptibles

  wireInput(
    'initSusceptible',
    'initSusceptibleCount',
    INITIAL_SUSCEPTIBLE,
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