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

import presetsManager from '../presetsManager';
import { TYPES } from '../CONSTANTS';

/** @class RelocationInfo describing all relevant information of a person relocating. */
export default class RelocationInfo {
  /**
   * Instantiates a RelocationInfo object.
   *
   * @constructor
   * @param {Person} person The person relocating.
   * @param {Coordinate} destination The coordinate of the destination of the person.
   * @param {number} destId The ID corresponding to the destination community.
   */
  constructor(person, destination, destId) {
    this.person = person;
    this.destination = destination;
    this.destId = destId;
    this.distDiffMargin = presetsManager.loadPreset().RELOCATION_ERROR_MARGIN;
    if (person.type === TYPES.INFECTIOUS) {
      console.log(person.age);
    }
  }

  /**
   * A function checking if the X coordinate of the person is close enough to the destination.
   *
   * @returns {Boolean} A boolean representing whether our person is close enough.
   */
  _isXInRange() {
    return (
      this.person.x > this.destination.x - this.distDiffMargin &&
      this.person.x < this.destination.x + this.distDiffMargin
    );
  }

  /**
   * A function checking if the Y coordinate of the person is close enough to the destination.
   *
   * @returns {Boolean} A boolean representing whether our person is close enough.
   */
  _isYInRange() {
    return (
      this.person.y > this.destination.y - this.distDiffMargin &&
      this.person.y < this.destination.y + this.distDiffMargin
    );
  }

  /**
   * A function checking if our person is close enough to its destination.
   *
   * @returns {Boolean} A boolean representing whether our person is close enough.
   */
  hasArrived() {
    return this._isXInRange() && this._isYInRange();
  }

  /**
   * A function making a person take a step towards his destination.
   */
  takeStep() {
    this.person.relocateMove(this.destination);
  }
}
