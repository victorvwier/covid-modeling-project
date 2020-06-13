import {ICU_CAPACITY, NUM_COMMUNITIES } from '../CONSTANTS';
// import {numCommunities} from '../model';


/**
 * A function returning the initial amount of susceptible people as set in the UI.
 *
 * @returns {number} The initial amount of susceptible people as set with the slider.
 */
export function getInitialNumSusceptible() {
  return parseInt(document.getElementById('initSusceptibleCount').value, 10);
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
 * A function to get the number of communities selected by the user
 * @returns {Number} number of communities
 */
export function getNumCommunities() {
  return parseInt(document.getElementById('numCommunities').value, 10);
}

/**
 * A function updating the displayed values on the page to the corresponding values.
 *
 * @param {number} numSusceptible The amount of susceptible people.
 * @param {number} numNonInfectious The amount of non-infectious people.
 * @param {number} numInfectious The amount of infectious people.
 * @param {number} numImmune The amount of immune people.
 * @param {number} numDead The amount of dead people.
 * @param {number} numIcu The amount of people in the ICU.
 */
export function updateTheStatistics(
  numSusceptible,
  numNonInfectious,
  numInfectious,
  numImmune,
  numDead,
  numIcu
) {
    const icuDIV=document.getElementById('icuDIV');


  if(numIcu < (0.75 * ICU_CAPACITY * NUM_COMMUNITIES)){
    icuDIV.style.backgroundColor="golden";
  }
  if(numIcu >= (0.75 * ICU_CAPACITY * NUM_COMMUNITIES) && numIcu< (0.90 * ICU_CAPACITY * NUM_COMMUNITIES)){
    icuDIV.style.backgroundColor="orange";
  }
  if(numIcu >= (0.90 * ICU_CAPACITY * NUM_COMMUNITIES) && numIcu< ( ICU_CAPACITY * NUM_COMMUNITIES)){
    // Light red if OCU is going to become full soon.
    icuDIV.style.backgroundColor="lightred";
  }
  else if(numIcu>=ICU_CAPACITY*NUM_COMMUNITIES){
    icuDIV.style.backgroundColor="red";
  }
  document.getElementById('s1').innerHTML = `${numSusceptible}`;
  document.getElementById('s2').innerHTML = `${numNonInfectious}`;
  document.getElementById('s3').innerHTML = `${numInfectious}`;
  document.getElementById('s4').innerHTML = `${numImmune}`;
  document.getElementById('s5').innerHTML = `${numDead}`;
  document.getElementById('s6').innerHTML = `${numIcu}/${ICU_CAPACITY*NUM_COMMUNITIES}`;

}
