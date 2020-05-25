export function getInitialNumSusceptible() {
  return parseInt(document.getElementById('initSusceptibleCount').value, 10);
}

export function getInitialNumInfectious() {
  return parseInt(document.getElementById('initInfectiousCount').value, 10);
}

export function updateTheStatistics(
  numSusceptible,
  numNonInfectious,
  numInfectious,
  numImmune,
  numDead
) {
  document.getElementById('s1').innerHTML = `${numSusceptible}`;
  document.getElementById('s2').innerHTML = `${numNonInfectious}`;
  document.getElementById('s3').innerHTML = `${numInfectious}`;
  document.getElementById('s4').innerHTML = `${numImmune}`;
  document.getElementById('s5').innerHTML = `${numDead}`;
}
