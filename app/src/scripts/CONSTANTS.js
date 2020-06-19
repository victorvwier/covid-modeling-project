export const MAXIMUM_DAYS = 365;

/**
 * An enum representing the different presets.
 *
 * @enum {String}
 */
export const PRESET_TYPES = {
  CANADA: 'Canada Data',
  LOW_POP: 'Low population',
  RIVM: 'Netherlands RIVM Data',
  HIGH_POP: 'High population',
};

/**
 * An enum representing the colors for the different states.
 *
 * @enum {String}
 */
export const COLORS = {
  SUSCEPTIBLE: '#05befc',
  NONINFECTIOUS: '#c9e265',
  INFECTIOUS: '#fd7e65',
  DEAD: 'black',
  IMMUNE: '#a6a6a6',
};

/**
 * An enum representing the different states.
 *
 * @enum {String}
 */
export const TYPES = {
  SUSCEPTIBLE: 's',
  NONINFECTIOUS: 'a',
  INFECTIOUS: 'i',
  DEAD: 'd',
  IMMUNE: 'im',
};

/**
 * An enum representing the different genders.
 *
 * @enum {String}
 */
export const GENDERS = {
  MALE: 'm',
  FEMALE: 'f',
};

/**
 * An enum representing the different parameters the timeline rules can affect.
 *
 * @enum {String}
 */
export const TIMELINE_PARAMETERS = {
  SOCIAL_DISTANCING: 'soc',
  ATTRACTION_TO_CENTER: 'atc',
};

/**
 * An enum representing the different stats the timeline rules can trigger on.
 *
 * @enum {String}
 */
export const TIMELINE_THRESHOLDS = {
  INFECTION_COUNT: 'inf',
  ICU_COUNT: 'icu',
};
