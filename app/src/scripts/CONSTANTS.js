export const INITIAL_SUSCEPTABLE = 99;
export const INITIAL_INFECTED = 3;
export const INITAL_ASYMPTOMATIC = 0;
export const INITIAL_IMMUNE = 0;
export const INITIAL_DEAD = 0;

export const PERSON_RADIUS = 10;
export const POPULATION_SPEED = 2;
export const INFECTION_RADIUS = PERSON_RADIUS + Math.floor(PERSON_RADIUS / 3);

export const TIME_UNTIL_SYMPTOMS = 2;
export const MORTALITY_RATE = 0.07;
export const TIME_UNTIL_DETECTION = 3;
export const ASYMPTOMATIC_PROB = 0.3;

export const COLORS = {
  SUSCEPTIBLE: '#05befc',
  ASYMPTOMATIC: '#c9e265',
  INFECTED: '#fd7e65',
  DEAD: 'black',
  IMMUNE: '#a6a6a6',
};

export const TYPES = {
  SUSCEPTIBLE: 's',
  ASYMPTOMATIC: 'a',
  INFECTED: 'i',
  // REMOVED: 'r',
  DEAD: 'd',
  IMMUNE: 'im',
};
