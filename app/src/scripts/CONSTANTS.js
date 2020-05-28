/** @constant INITIAL_SUSCEPTIBLE Default initial amount of Susceptible people in the model. */
export const INITIAL_SUSCEPTIBLE = 100;
/** @constant INITAL_NONINFECTIOUS Default initial amount of Non-Infectious people in the model. */
export const INITIAL_NONINFECTIOUS = 0;
/** @constant INITAL_INFECTIOUS Default initial amount of Infectious people in the model. */
export const INITAL_INFECTIOUS = 120;
/** @constant INITIAL_IMMUNE Default initial amount of Immune people in the model. */
export const INITIAL_IMMUNE = 0;
/** @constant INITIAL_DEAD Default initial amount of Dead people in the model. */
export const INITIAL_DEAD = 0;
/** @constant REPULSION_FORCE Default value of the Social Distancing parameter. */
export const REPULSION_FORCE = 0;
/** @constant ATTRACTION_FORCE Default value of the Attraction to center parameter. */
export const ATTRACTION_FORCE = 0;
/** @constant PERSON_RADIUS Default value of the radius attribute of a person. */
export const PERSON_RADIUS = 5;
/** @constant POPULATION_SPEED Default value of the maxSpeed attribute of a community and person. */
export const POPULATION_SPEED = 4;
/** @constant INFECTION_RADIUS Default value of the infectionRadius attribute of a person. */
export const INFECTION_RADIUS = PERSON_RADIUS + Math.floor(PERSON_RADIUS / 3);
/** @constant MOVEMENT_TIME_SCALAR Scalar for the timestep provided when moving a person. */
export const MOVEMENT_TIME_SCALAR = 10;
/** @constant TRANSMISSION_PROB Default value for the probability of transmission between people. */
export const TRANSMISSION_PROB = 0.9;
/** @constant NONIN_TO_IMMUNE_PROB Probability a person moves from the Non-Infectious state to the Immune state. */
export const NONIN_TO_IMMUNE_PROB = 0.1;
/** @constant TIME_UNTIL_IMMUNE Default value for the time from the Infectious state to the Immune state. */
export const TIME_UNTIL_IMMUNE = 7;

/** @constant MIN_INCUBATION_TIME Default value for the minimum time from the Non-Infectious state to the Infectious state. */
export const MIN_INCUBATION_TIME = 7;
/** @constant MAX_INCUBATION_TIME Default value for the maximum time from the Non-Infectious state to the Infectious state. */
export const MAX_INCUBATION_TIME = 14;

/** @constant MIN_INFECTIOUS_TIME Default value for the minimum time from the Infectious state to the Immune state. */
export const MIN_INFECTIOUS_TIME = 5;
/** @constant MAX_INFECTIOUS_TIME Default value for the maximum time from the Infectious state to the Immune state. */
export const MAX_INFECTIOUS_TIME = 10;

/** @constant MIN_TIME_UNTIL_DEAD Default value for the minimum time from the Infectious state to the Dead state. */
export const MIN_TIME_UNTIL_DEAD = 15;
/** @constant MAX_TIME_UNTIL_DEAD Default value for the maximum time from the Infectious state to the Dead state. */
export const MAX_TIME_UNTIL_DEAD = 30;

/** @constant DAYS_PER_SECOND Amount of days that are simulated every second. */
export const DAYS_PER_SECOND = 2;

/** 
 * Enum for the colors related to the states a person can be in.
 * @readonly
 * @enum {string} 
 */
export const COLORS = {
  SUSCEPTIBLE: '#05befc',
  NONINFECTIOUS: '#c9e265',
  INFECTIOUS: '#fd7e65',
  DEAD: 'black',
  IMMUNE: '#a6a6a6',
};

/**
 * Enum for the states a person can be in.
 * @readonly
 * @enum {string}
 */
export const TYPES = {
  SUSCEPTIBLE: 's',
  NONINFECTIOUS: 'a',
  INFECTIOUS: 'i',
  DEAD: 'd',
  IMMUNE: 'im',
};

/** @constant SPACE_BETWEEN_COMMUNITIES The amount of pixels used as spacing inbetween communities. */
export const SPACE_BETWEEN_COMMUNITIES = 20;

/** @constant RELOCATION_PROBABILITY The probability a person will relocate to a different community. */
export const RELOCATION_PROBABILITY = 0.0002;
/** @constant RELOCATION_ERROR_MARGIN The distance a person is allowed to be offset from his destination to finish relocating. */
export const RELOCATION_ERROR_MARGIN = 20;
/** @constant RELOCATION_STEP_SIZE The amount of steps the distance to a persons destination is divided up into. */
export const RELOCATION_STEP_SIZE = 80;
