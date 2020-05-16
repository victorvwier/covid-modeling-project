export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Gets random between min-max inclusive
 * @param {*} min
 * @param {*} max
 */
export function getRandomIntExceptForValue(min, max, exceptFor = []) {
  const rand = Math.round(Math.random() * (max + 1));
  return exceptFor.includes(rand) || rand > max
    ? getRandomIntExceptForValue(min, max, exceptFor)
    : rand;
}

export function gaussianRand(min, max) {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) num = this.gaussianRand(min, max);
  num *= max - min;
  num += min;
  return Math.round(num);
}

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
