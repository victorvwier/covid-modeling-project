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

import { TIMELINE_PARAMETERS } from '../CONSTANTS';

/**
 * Enum for different types of timeline rules.
 * @enum {String}
 */
export const TimelineRuleType = {
  TIME: 'time',
  THRESHOLD: 'threshold',
};

/** @class TimelineRule describing a rule on the timeline. */
export class TimelineRule {

  /**
   * Instantiates a TimelineRule.
   *
   * @constructor
   * @param {TimelineRuleType} type The type of rule.
   * @param {TIMELINE_PARAMETERS} target The parameter targeted by the rule.
   */
  constructor(type, target) {
    this.type = type;
    this.target = target;
    if (target === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
      this.name = 'Social distancing';
    }
    if (target === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
      this.name = 'Attraction to center';
    }

    // Records the past times this rule has been active
    this.activeHistory = [];
  }

  static newSimpleRule(target, start, end, val) {
    const rule = new TimelineRule(TimelineRuleType.TIME, target);
    rule.target = target;
    rule.start = start;
    rule.end = end;
    rule.value = val;

    let e = null;
    if (target === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
      e = document.getElementById('repulsionForce');
    } else if (target === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
      e = document.getElementById('attractionForce');
    }
    if (e) {
      rule.oldval = e.value;
    } else {
      rule.oldval = 0;
    }
    return rule;
  }

  /**
   * A function to create a new threshold based rule.
   *
   * @static
   * @param {TIMELINE_PARAMETERS} target The parameter targeted by the rule.
   * @param {TIMELINE_THRESHOLDS} param The parameter triggering the rule.
   * @param {number} trigger The boundary value of the triggering value.
   * @param {number} val The new value of the target.
   * @param {number} oldval The old value of the target.
   * @returns {TimelineRule} The resulting rule.
   */
  static newThresholdRule(target, param, trigger, val) {
    const rule = new TimelineRule(TimelineRuleType.THRESHOLD, target);
    rule.param = param;
    rule.trigger = trigger;
    rule.value = val;

    let e = null;
    if (target === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
      e = document.getElementById('repulsionForce');
    } else if (target === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
      e = document.getElementById('attractionForce');
    }
    if (e) {
      rule.oldval = e.value;
    } else {
      rule.oldval = 0;
    }

    rule.start = 0;
    rule.end = 0;
    return rule;
  }

  reset() {
    this.activeHistory = [];
  }
  
  /**
   * A function to check whether the rule is active.
   *
   * @param {Stats} stats A stats object containing the current stats of the model.
   * @param {number} time The current time in the model.
   * @returns {Boolean} A boolean representing whether or not the rule is active.
   */
  isActive(stats, time) {
    let ret = false;

    if (this.type === TimelineRuleType.THRESHOLD) {
      if (this.param === 'inf') {
        ret = stats.infectious >= this.trigger;
      }

      if (this.param === 'icu') {
        ret = stats.icu >= this.trigger;
      }
    } else if (this.type === TimelineRuleType.TIME) {
      ret = time <= this.end && time >= this.start;
    } else {
      throw new Error('Wrong type specified');
    }

    if (ret) {
      this.activeHistory.push(time);
    }

    return ret;
  }
}
