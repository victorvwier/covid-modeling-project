/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

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
