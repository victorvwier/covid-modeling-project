import { getRandomInt } from './util';
import presetsManager from './presetsManager';
import { GENDERS } from './CONSTANTS';

const { AGE, MORTALITY_RATE, DEMOGRAPHIC } = presetsManager.loadPreset();

function getAge() {
  return presetsManager.loadPreset().AGE;
}

/**
 * Sets the age, gender and mortality rate for a given person based on real distirbution data.
 *
 * @param {Person} person the person whose demographic will be assigned.
 */
export function assignDemographic(person) {
  const rand = Math.random();

  // demographic has 40 people
  // 0-39 are the values

  let index = 0;
  let previous = 0;
  for (let i = 0; i < DEMOGRAPHIC.length; i++) {
    if (rand <= DEMOGRAPHIC[i] && rand > previous) {
      index = i;
      break;
    }
    previous = DEMOGRAPHIC[i];
  }

  const limit = AGE.length;

  const age = getRandomInt(AGE[index % limit].min, AGE[index % limit].max);
  person.age = age;

  if (index < limit) {
    person.gender = GENDERS.MALE;
  } else {
    person.gender = GENDERS.FEMALE;
  }

  person.mortalityRate = MORTALITY_RATE[index];

  console.log(
    'Age: ' +
      `${person.age} ` +
      ' Gender: ' +
      `${person.gender} ` +
      ' MR: ' +
      `${person.mortalityRate} `
  );
}
