export const PERSON_RADIUS = 10;
export const POPULATION_SPEED = 2;
export const INFECTION_RADIUS = PERSON_RADIUS + PERSON_RADIUS / 3;

export const INITIAL_INFECTED = 5;

export const TIME_UNTIL_SYMPTOMS = 2;
export const MORTALITY_RATE = 0.07;
export const TIME_UNTIL_DETECTION = 3;
export const ASYMPTOMATIC_PROB = 0.3;

export const COLORS = {
  SUSCEPTIBLE: 'blue',
  ASYMPTOMATIC: 'yellow',
  INFECTED: 'red',
  DEAD: 'black',
  IMMUNE: 'green',
};

export const TYPES = {
  SUSCEPTIBLE: 's',
  ASYMPTOMATIC: 'a',
  INFECTED: 'i',
  // REMOVED: 'r',
  DEAD: 'd',
  IMMUNE: 'im',
};
