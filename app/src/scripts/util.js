export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

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
  return Math.round(num);
}
