export const INITIAL_SUSCEPTABLE = 100;
export const INITIAL_NONINFECTIOUS = 0;
export const INITAL_INFECTIOUS = 1;
export const INITIAL_IMMUNE = 0;
export const INITIAL_DEAD = 0;

export const PERSON_RADIUS = 5;
export const POPULATION_SPEED = 2;
export const INFECTION_RADIUS = PERSON_RADIUS + Math.floor(PERSON_RADIUS / 3);

export const TIME_UNTIL_SYMPTOMS = 10;
export const MORTALITY_RATE = 0.116;
export const ASYMPTOMATIC_PROB = 0.25;
export const TRANSMISSION_PROB = 0.9;
export const INCUBATION_PERIOD = 5;
export const NONIN_TO_IMMUNE_PROB = 0.1;
export const TIME_UNTIL_IMMUNE = 7;
export const TIME_UNTIL_DEAD = 10;

export const COLORS = {
  SUSCEPTIBLE: '#05befc',
  NONINFECTIOUS: '#c9e265',
  INFECTIOUS: '#fd7e65',
  DEAD: 'black',
  IMMUNE: '#a6a6a6',
};

export const TYPES = {
  SUSCEPTIBLE: 's',
  NONINFECTIOUS: 'a',
  INFECTIOUS: 'i',
  DEAD: 'd',
  IMMUNE: 'im',
};
