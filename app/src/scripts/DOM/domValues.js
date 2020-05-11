export function getInitialNumSusceptable() {
  return parseInt(document.getElementById('initSusceptableCount').value, 10);
}

export function getInitialNumInfectious() {
  return parseInt(document.getElementById('initInfectiousCount').value, 10);
}
