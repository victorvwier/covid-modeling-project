import {
  TRANSMISSION_PROB,
  NONIN_TO_IMMUNE_PROB,
  MIN_INCUBATION_TIME,
  MAX_INCUBATION_TIME,
  INFECTION_RADIUS,
  // PERSON_RADIUS,
  INITIAL_INFECTIOUS,
  INITIAL_SUSCEPTIBLE,
  MIN_INFECTIOUS_TIME,
  MAX_INFECTIOUS_TIME,
  MIN_TIME_UNTIL_DEAD,
  MAX_TIME_UNTIL_DEAD,
  REPULSION_FORCE,
  ATTRACTION_FORCE,
  NUM_COMMUNITIES,
  TESTED_POSITIVE_PROBABILITY,
  INFECTION_RADIUS_REDUCTION_FACTOR,
  ICU_PROBABILITY,
  ICU_CAPACITY,
} from '../CONSTANTS';

// The outValOp is for percentages, we can pass a function that will multiply a fraction by 100 for displaying to user
// Otherwise the default is just a function that returns the variable itself
/**
 * A function linking the output numbers to the sliders and their relevant values inside the model.
 *
 * @param {string} inputId The name given to the slider in the HTML.
 * @param {string} outputId The name given to the output value in the HTML.
 * @param {number} initial The default value of the output.
 * @param {string} suffix A string representing the unit of the value.
 * @param {function} setter A setter function inside the model which should be passed the value of the slider.
 * @param {function} outValOp A function applied between the slider and output value if these don't correspond.
 */
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

/**
 * A function binding the sliders to a specific model.
 *
 * @param {Model} community The model to bind the sliders to.
 */
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
  // TestedPositiveProbability
  wireInput(
    'testedPositiveProb',
    'testedPositiveProbOut',
    TESTED_POSITIVE_PROBABILITY,
    '%',
    community.updateTestedPositiveProbability.bind(community),
    (x) => x * 100
  );
  // InfectionRadiusReductionFactor
  wireInput(
    'InfectionRadiusRedFactor',
    'InfectionRadiusRedFactorOut',
    INFECTION_RADIUS_REDUCTION_FACTOR,
    '',
    community.updateInfectionRadiusReductionFactor.bind(community)
  );
  // IcuProbability
  wireInput(
    'IcuProb',
    'IcuProbOut',
    ICU_PROBABILITY,
    '%',
    community.updateIcuProbability.bind(community),
    (x) => x * 100
  );
  // IcuCapacity
  wireInput(
    'IcuCapacity',
    'IcuCapacityOut',
    ICU_CAPACITY,
    '',
    community.updateIcuCapacity.bind(community)
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
    INITIAL_INFECTIOUS,
    '',
    (x) => x // Don't need a setter
  );

  wireInput(
    'numCommunities',
    'numCommunitiesOut',
    NUM_COMMUNITIES,
    '',
    (x) => x
  );
}

/**
 * A function binding the reload button to our main class.
 *
 * @param {Main} main The instance of the main class to bind our reload button to.
 */
export function wireReloadButtonToMain(main) {
  // Reset button
  document
    .getElementById('reload')
    .addEventListener('click', () => main.reset());
}
