export function getInitialNumSusceptable() {
  return parseInt(document.getElementById('initSusceptableCount').value, 10);
}

export function getInitialNumInfectious() {
  return parseInt(document.getElementById('initInfectiousCount').value, 10);
}

export function updateTheStatistics(numSusceptible,numNonInfectious,numInfectious,numImmune,numDead){
  document.getElementById("s1").innerHTML =`Susceptible ${numSusceptible}` ;
  document.getElementById("s2").innerHTML =`Non infectious ${numNonInfectious}` ;
  document.getElementById("s3").innerHTML =`Infectious ${numInfectious}` ;
  document.getElementById("s4").innerHTML =`Immune ${numImmune}` ;
  document.getElementById("s5").innerHTML =`Dead ${numDead}` ;
}