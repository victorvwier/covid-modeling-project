/** @constant INITIAL_SUSCEPTIBLE Default initial amount of Susceptible people in the model. */
export const INITIAL_SUSCEPTIBLE = 100;
/** @constant INITAL_NONINFECTIOUS Default initial amount of Non-Infectious people in the model. */
export const INITIAL_NONINFECTIOUS = 0;
/** @constant INITIAL_INFECTIOUS Default initial amount of Infectious people in the model. */
export const INITIAL_INFECTIOUS = 200;
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
/** @constant INTERACTION_RANGE the infectious range of a person */
export const INTERACTION_RANGE = 20;
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

/** @constant NUM_COMMUNITIES The initial number of communities */
export const NUM_COMMUNITIES = 4;

/** @constant TESTED_POSITIVE_PROBABILITY The probability an Infectious person will be tested positive. */
export const TESTED_POSITIVE_PROBABILITY=0.5;
/** @constant INFECTION_RADIUS_REDUCTION_FACTOR The factor with with the infection radius is reduced for a positive person. */
export const INFECTION_RADIUS_REDUCTION_FACTOR=3;

/** @constant ICU_PROBABILITY The probability a person goes to the ICU when tested positive. */
export const ICU_PROBABILITY = 0.1;
/** @constant ICU_CAPACITY The capacity of the ICU of a single community. */
export const ICU_CAPACITY = 20;

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
/**
 * Enum for the gender of a person.
 * @readonly
 * @enum {string}
 */
export const GENDERS = {
  MALE: 'm',
  FEMALE: 'f',
};

/** @constant SPACE_BETWEEN_COMMUNITIES The amount of pixels used as spacing inbetween communities. */
export const SPACE_BETWEEN_COMMUNITIES = 20;

/** @constant RELOCATION_PROBABILITY The probability a person will relocate to a different community. */
export const RELOCATION_PROBABILITY = 0.00005;
/** @constant RELOCATION_ERROR_MARGIN The distance a person is allowed to be offset from his destination to finish relocating. */
export const RELOCATION_ERROR_MARGIN = 20;
/** @constant RELOCATION_STEP_SIZE The amount of steps the distance to a persons destination is divided up into. */
export const RELOCATION_STEP_SIZE = 80;

/**
 * Enum for the gender of a person.
 * @readonly
 * @enum {string}
 */
export const GENDER = {
  MALE: 'm',
  FEMALE: 'f',
};

/** @constant AGE The division of ages associated with the demographics. */
export const AGE = [
  { min: 0, max: 4 },
  { min: 5, max: 9 },
  { min: 10, max: 14 },
  { min: 15, max: 19 },
  { min: 20, max: 24 },
  { min: 25, max: 29 },
  { min: 30, max: 34 },
  { min: 35, max: 39 },
  { min: 40, max: 44 },
  { min: 45, max: 49 },
  { min: 50, max: 54 },
  { min: 55, max: 59 },
  { min: 60, max: 64 },
  { min: 65, max: 69 },
  { min: 70, max: 74 },
  { min: 75, max: 79 },
  { min: 80, max: 84 },
  { min: 85, max: 89 },
  { min: 90, max: 94 },
  { min: 95, max: 100 },
];

/** @constant DEMOGRAPHIC The age and gender demographics. The first 20 are the male population percentage per
 * age group and the last 20 are the same for the female populations. It is a cumulative probability. */
export const DEMOGRAPHIC = [
  0.02589693,
  0.052908434,
  0.081541672,
  0.112174604,
  0.142873219,
  0.175030442,
  0.206610024,
  0.23637591,
  0.266318023,
  0.300792303,
  0.338596967,
  0.375050937,
  0.407296772,
  0.436261294,
  0.462565661,
  0.479207701,
  0.490045957,
  0.495681525,
  0.497577633,
  0.498140126,
  0.522737355,
  0.548330725,
  0.575433472,
  0.60449146,
  0.63382236,
  0.66485647,
  0.695669842,
  0.724926635,
  0.754790549,
  0.789301443,
  0.826650475,
  0.862457669,
  0.894790009,
  0.924629591,
  0.952253888,
  0.970990842,
  0.985063736,
  0.994304589,
  0.998602095,
  1.0,
];

/** @constant MORTALITY_RATE The mortality rate of an agent based on age and gender. */
export const MORTALITY_RATE = [
  0,
  0,
  0,
  0.00017316,
  0,
  0.000519481,
  0.00034632,
  0.000865801,
  0.000865801,
  0.001385281,
  0.004155844,
  0.012467532,
  0.018354978,
  0.035844156,
  0.063896104,
  0.10995671,
  0.122943723,
  0.116363636,
  0.052467532,
  0.012640693,
  0,
  0,
  0,
  0,
  0,
  0,
  0.00017316,
  0.00034632,
  0,
  0.002424242,
  0.003290043,
  0.003982684,
  0.008658009,
  0.019047619,
  0.04034632,
  0.057316017,
  0.086406926,
  0.106666667,
  0.081212121,
  0.036883117,
];
