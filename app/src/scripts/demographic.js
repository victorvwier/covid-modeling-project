/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

/* eslint-disable import/first */

import { getRandomInt, getRandom } from './util';
import presetsManager from './presetsManager';
import { GENDERS } from './CONSTANTS';

const { AGE, MORTALITY_RATE, DEMOGRAPHIC } = presetsManager.loadPreset();

/**
 * Sets the age, gender and mortality rate for a given person based on real distirbution data.
 *
 * @param {Person} person the person whose demographic will be assigned.
 */
export function assignDemographic(person) {
  const rand = getRandom();

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
}
