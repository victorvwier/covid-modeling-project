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


window.randoms = [];

/**
 * a function returning a random number inbetween the minimum and maximum value. Is inclusive of its bounds.
 *
 * @param {number} min the lower bound of the range.
 * @param {number} max the upper bound of the range.
 * @returns {number} a random number inbetween min and max.
 */
export function getRandom(min = 0, max = 1) {
  const rand = Math.random() * (max - min) + min;
  window.randoms.push(rand);
  return rand;
}

/**
 * Gets random Integer between min-max inclusive.
 *
 * @param {number} min the lower bound of the range.
 * @param {number} max the upper bound of the range.
 * @param {Array{Int}} exceptFor integers to be excluded from possible results.
 * @returns {Int} Random integer for which min <= n <= max and n not in exceptFor.
 */
export function getRandomIntExceptForValue(min, max, exceptFor = []) {
  const rand = Math.round(getRandom() * (max + 1));
  return exceptFor.includes(rand) || rand > max
    ? getRandomIntExceptForValue(min, max, exceptFor)
    : rand;
}

/**
 * A function that returns a random integer in range
 * @param {Number} min
 * @param {Number} max
 * @returns random integer in the range (min, max)
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(getRandom() * (max - min + 1)) + min;
}

/**
 * Returns a random number on a gaussian distribution.
 *
 * @param {number} min lower bound on possible results.
 * @param {number} max upper bound on possible results.
 * @returns {number} random number between min and max, normally distributed.
 */
export function gaussianRand(min, max) {
  let u = 0;
  let v = 0;
  while (u === 0) u = getRandom();
  while (v === 0) v = getRandom();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) num = gaussianRand(min, max);
  num *= max - min;
  num += min;
  return num;
}

// export function seedRandomValue() {
//   const seedrandom = require('seedrandom');
//   const rng = seedrandom('hello.');

//   return rng();
// }
