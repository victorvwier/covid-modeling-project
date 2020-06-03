import { AGE, MORTALITY_RATE, DEMOGRAPHIC, GENDER } from './CONSTANTS';
import { getRandomInt } from './util';

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

  const age = getRandomInt(AGE[index % 20].min, AGE[index % 20].max);
  person.age = age;

  if (index < 20) {
    person.gender = GENDER.MALE;
  } else {
    person.gender = GENDER.FEMALE;
  }

  person.mortalityRate = MORTALITY_RATE[index];
}
