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

/** @class Stats describing the stats of a community or model. */
export default class Stats {
  
  /**
   * Instantiates a Stats object.
   * 
   * @constructor
   * @param {number} susceptible The amount of susceptible people.
   * @param {number} noninfectious The amount of non-infectious people.
   * @param {number} infectious The amount of infectious people.
   * @param {number} dead The amount of dead people.
   * @param {number} immune The amount of immune people.
   * @param {number} icu The amount of people in the ICU.
   */
  constructor(susceptible, noninfectious, infectious, dead, immune, icu) {
    this.susceptible = susceptible;
    this.noninfectious = noninfectious;
    this.infectious = infectious;
    this.dead = dead;
    this.immune = immune;
    this.icu = icu;
  }

  /**
   * A function summing all of the stats, giving the total number of people represented.
   *
   * @returns {number} The total number of people.
   */
  sum() {
    return (
      this.susceptible +
      this.noninfectious +
      this.infectious +
      this.dead +
      this.immune
    );
  }

  /**
   * A function allowing us to add together two stats objects.
   *
   * @param {Stats} one An instance of a Stats object to be added.
   * @param {Stats} other An instance of a Stats object to be added.
   * @returns {Stats} An instance of a Stats objects representing both parameters added together.
   */
  static joinStats(one, other) {
    return new Stats(
      one.susceptible + other.susceptible,
      one.noninfectious + other.noninfectious,
      one.infectious + other.infectious,
      one.dead + other.dead,
      one.immune + other.immune,
      one.icu + other.icu
    );
  }

  /**
   * A function to retrieve the amount of people in the ICU.
   * 
   * @returns {number} The amount of people in the ICU.
   */
  getICUCount(){
    return this.icu;
  }
}
