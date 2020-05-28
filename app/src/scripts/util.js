/**
 * a function returning a random number inbetween the minimum and maximum value. Is inclusive of its bounds.
 *
 * @param {number} min the lower bound of the range.
 * @param {number} max the upper bound of the range.
 * @returns {number} a random number inbetween min and max.
 */
export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
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
  const rand = Math.round(Math.random() * (max + 1));
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
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) num = gaussianRand(min, max);
  num *= max - min;
  num += min;
  return num;
}

/**
 * Returns the mortality rate coupled to the age.
 *
 * @param {number} age The age for which the mortality rate is to be retrieved.
 * @returns {number} The mortality rate of people that age.
 */
export function mortalityStat(age) {
  if (0 <= age && age <= 9) {
    return 0;
  } else if (10 <= age && age <= 19) {
    return 0.002;
  } else if (20 <= age && age <= 29) {
    return 0.002;
  } else if (30 <= age && age <= 39) {
    return 0.002;
  } else if (40 <= age && age <= 49) {
    return 0.004;
  } else if (50 <= age && age <= 59) {
    return 0.013;
  } else if (60 <= age && age <= 69) {
    return 0.036;
  } else if (70 <= age && age <= 79) {
    return 0.08;
  } else {
    return 0.148;
  }
}
