import { AGE, MORTALITY_RATE, DEMOGRAPHIC, GENDER } from './CONSTANTS';
import Person from './person';
import { getRandomInt } from './util';

/**
 * Sets the age, gender and mortality rate for a given person based on real distirbution data.
 *
 * @param {Person} person the person whose demographic will be assigned.
 */
export function assignDemographic(person) {
  const rand = Math.random();

  let index = 0;
  for (let i = 0; i < DEMOGRAPHIC.length - 1; i++) {
    if (rand > DEMOGRAPHIC[i] && rand <= DEMOGRAPHIC[i + 1]) {
      index = i;
      break;
    }
  }

  const age = getRandomInt(AGE[index % 19].min, AGE[index % 19].max);
  person.age = age;

  if (index < 20) {
    person.gender = GENDER.MALE;
  } else {
    person.gender = GENDER.FEMALE;
  }

  person.mortalityRate = 1;
}
