/**
 * A function returning the initial amount of susceptible people as set in the UI.
 *
 * @returns {number} The initial amount of susceptible people as set with the slider.
 */
export function getInitialNumSusceptible() {
  return parseInt(document.getElementById('initSusceptibleCount').value, 10);
}

/**
 * A function setting the initial amount of susceptible people.
 */
export function setInitialNumSusceptible(newValue) {
  document.getElementById('initSusceptibleCount').value = newValue;
}

/**
 * A function returning the initial amount of infectious people as set in the UI.
 *
 * @returns {number} The initial amount of infectious people as set with the slider.
 */
export function getInitialNumInfectious() {
  return parseInt(document.getElementById('initInfectiousCount').value, 10);
}

/**
 * A function setting the initial amount of infectious people.
 */
export function setInitialNumInfectious(newValue) {
  document.getElementById('initInfectiousCount').value = newValue;
}

/**
 * A function to get the number of communities selected by the user
 * @returns {Number} number of communities
 */
export function getNumCommunities() {
  return parseInt(document.getElementById('numCommunities').value, 10);
}

/**
 * A function setting the initial amount of infectious people.
 */
export function setNumCommunities(newValue) {
  document.getElementById('numCommunities').value = newValue;
}

/**
 * A function updating the displayed values on the page to the corresponding values.
 *
 * @param {number} numSusceptible The amount of susceptible people.
 * @param {number} numNonInfectious The amount of non-infectious people.
 * @param {number} numInfectious The amount of infectious people.
 * @param {number} numImmune The amount of immune people.
 * @param {number} numDead The amount of dead people.
 */
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
