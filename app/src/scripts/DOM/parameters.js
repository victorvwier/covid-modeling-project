import {
  TIME_UNTIL_SYMPTOMS,
  TIME_UNTIL_IMMUNE,
  INFECTION_RADIUS,
  ASYMPTOMATIC_PROB,
  PERSON_RADIUS,
  INITIAL_SUSCEPTABLE,
  INITIAL_SYMPTOMATIC,
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
    'timeToSymptoms',
    'timeToSymptomsOut',
    TIME_UNTIL_SYMPTOMS,
    'days',
    model.setTimeUntilSymptoms.bind(model)
  );

  // timeUntilImmune
  wireInput(
    'timeUntilImmune',
    'timeUntilImmuneOut',
    TIME_UNTIL_IMMUNE,
    'days',
    model.setTimeUntilImmune.bind(model)
  );

  // Infection radius
  wireInput(
    'infectionCircleRadius',
    'infectionRadiusOut',
    INFECTION_RADIUS,
    'people',
    model.setInfectionRadius.bind(model)
  );

  // asymptomaticProbability
  wireInput(
    'asymptomaticProbability',
    'asymptomaticProbabilityOut',
    ASYMPTOMATIC_PROB,
    '%',
    model.setAsymptomaticProb.bind(model),
    (x) => x * 100
  );

  // agentRadius
  wireInput(
    'agentRadius',
    'agentRadiusOut',
    PERSON_RADIUS,
    '',
    model.setPersonRadius.bind(model)
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
    'initSymptomatic',
    'initSymptomaticCount',
    INITIAL_SYMPTOMATIC,
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
