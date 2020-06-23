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

import { TimelineRule, TimelineRuleType } from './data/timelinerule';
import presetsManager from './presetsManager';
import { TIMELINE_PARAMETERS, MAXIMUM_DAYS } from './CONSTANTS';

const RULE_HEIGHT = 40;
const TIMELINE_X_OFFSET = 170;
const RULE_MARGINS = 10;

function getRules() {
  return presetsManager.loadPreset().RULES;
}

/** @class Timeline describing a timeline on which rules can be added. */

export class Timeline {
  /**
   * Instantiates a timeline.
   *
   * @constructor
   * @param {Object} canvas The canvas the timeline is drawn on.
   * @param {function} setruleCb A callback function to set a rule.
   */
  constructor(canvas, setruleCb, getruleCb, clearRulesList, setRulesList) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.rules = [];
    this.setRuleCallback = setruleCb;
    this.getRuleCallback = getruleCb;
    this.clearRulesList = clearRulesList;
    this.setRulesList = setRulesList;
  }

  changePreset() {
    this.rules = [];
    this.clearRulesList();
    this.setRulesList(this.toStringList(this.rules), this);
    this.importPresetRules();
  }

  importPresetRules() {
    const presetRules = getRules();
    if (presetRules.length > 0) {
      for (let i = 0; i < presetRules.length; i++) {
        const rule = presetRules[i];
        this.addPresetRule(rule);
      }
    }
  }

  addPresetRule(rule) {
    if (rule.type === 'time') {
      rule.type = TimelineRuleType.TIME;
    } else if (rule.type === 'threshold') {
      rule.type = TimelineRuleType.THRESHOLD;
    }

    if (rule.params[0] === 'soc') {
      rule.params[0] === TIMELINE_PARAMETERS.SOCIAL_DISTANCING;
    } else if (rule.params[0] === 'atc') {
      rule.params[0] === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER;
    }
    this.addRule(rule.type, rule.params);
  }

  _addPresetRule(type, params) {
    if (type === TimelineRuleType.TIME) {
      const rule = TimelineRule.newSimpleRule(
        params[0],
        params[1],
        params[2],
        params[3]
      );
      this._addRule(rule);
    }
    if (type === TimelineRuleType.THRESHOLD) {
      const rule = TimelineRule.newThresholdRule(
        params[0],
        params[1],
        params[2],
        params[3]
      );
      this._addRule(rule);
    }
  }

  /**
   * A function to update the timeline.
   *
   * @param {Stats} stats The stats at the current moment.
   * @param {number} time The number representing the current time.
   */
  update(stats, time) {
    this.time = time;
    this.redrawTimeline();
    this.enforceRules(stats, time);
  }

  reset() {
    for (let i = 0; i < this.rules.length; i++) {
      this.rules[i].reset();
    }
  }

  /**
   * A function to add a rule to the timeline.
   *
   * @param {TimelineRuleType} type The type of rule being added.
   * @param {number[]} params An array containing the parameters for the rule.
   */
  addRule(type, params) {
    if (type === TimelineRuleType.TIME) {
      const rule = TimelineRule.newSimpleRule(
        params[0],
        params[1],
        params[2],
        params[3]
      );
      this._addRule(rule);
    }
    if (type === TimelineRuleType.THRESHOLD) {
      const rule = TimelineRule.newThresholdRule(
        params[0],
        params[1],
        params[2],
        params[3]
      );
      this._addRule(rule);
    }
  }

  /**
   * A function to add an existing rule to the timeline.
   *
   * @param {TimelineRule} rule The rule to be added.
   */
  _addRule(rule) {
    let found = false;
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].target === rule.target) {
        if (
          rule.type === TimelineRuleType.TIME &&
          this.rules[i].type === TimelineRuleType.TIME
        ) {
          if (this.overlap(rule, this.rules[i])) {
            found = true;
            // this rule cannot be added because it overlaps with a previous rule
            throw new Error("This rule cannot be added because it overlaps with a previous rule.");
          }
        }

        if (
          rule.type === TimelineRuleType.THRESHOLD &&
          this.rules[i].type === TimelineRuleType.THRESHOLD
        ) {
          if (rule.param === this.rules[i].param) {
            found = true;
            // this rule cannot be added because it affects a parameter that already has a threshold rule associated with it and has the same trigger parameter as this rule.
            throw new Error("This rule cannot be added because it affects a parameter that already has a threshold rule associated with it and has the same trigger parameter as this rule.");
          }
        }
      }
    }

    if (!found) {
      this.rules.push(rule);
      this.clearRulesList();
      this.setRulesList(this.toStringList(this.rules), this);
    }
  }

  overlap(rule1, rule2) {
    if (rule1.end < rule2.start || rule2.end < rule1.start) {
      return false;
    }
    return true;
  }

  /**
   * A function to enforce all current rules.
   *
   * @param {Stats} stats The current stats.
   * @param {number} time The current timestamp.
   */
  enforceRules(stats, time) {
    // get slider value for target

    for (let i = 0; i < this.rules.length; i++) {
      const targ = this.rules[i].target;
      const previousVal = this.getRuleCallback(targ);
      this.setRuleCallback(targ, previousVal);
    }

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      if (rule.isActive(stats, time)) {
        rule.active = true;
        this.setRuleCallback(rule.target, rule.value);
      } else {
        rule.active = false;
      }
    }
  }

  deleteRule(index) {
    this.rules.splice(index, 1);
    this.clearRulesList();
    this.setRulesList(this.toStringList(this.rules), this);
  }

  /**
   * A function to redraw the timeline to be up to date.
   */
  redrawTimeline() {
    // Set canvas to the right height
    this.canvas.height = RULE_HEIGHT * this.rules.length;

    // Draw background first
    this.context.beginPath();
    this.context.rect(
      TIMELINE_X_OFFSET,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.context.fillStyle = '#cccccc';
    this.context.fill();

    // Draw all the rules we have in place
    for (let i = 0; i < this.rules.length; i++) {
      this.drawRule(this.rules[i], i * RULE_HEIGHT);
    }

    // The the progress line
    const xCoord = this.getXforDay(this.time);
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.moveTo(xCoord, 0);
    this.context.lineTo(xCoord, this.canvas.height);
    this.context.stroke();
  }

  /**
   * A function to draw a rule on the timeline.
   *
   * @param {TimelineRule} rule The rule to be drawn
   * @param {number} yOffset The offset on the y-axis.
   */
  drawRule(rule, yOffset) {
    // Draw the rule text
    this.context.font = rule.active ? 'bold 13px Roboto' : '14px Roboto';
    this.context.fillStyle = 'black';

    this.context.fillText(`${rule.name}`, 0, yOffset + RULE_HEIGHT / 3);
    this.context.fillText(
      `Value: ${rule.value}%`,
      0,
      yOffset + (2.2 * RULE_HEIGHT) / 3
    );

    // Draw the rule bar
    if (rule.type === TimelineRuleType.TIME) {
      const xCoords = [this.getXforDay(rule.start), this.getXforDay(rule.end)];

      this.context.beginPath();
      this.context.rect(
        xCoords[0],
        yOffset + RULE_MARGINS,
        xCoords[1] - xCoords[0],
        RULE_HEIGHT - RULE_MARGINS * 2
      );
      this.context.fillStyle = '#a6a6a6';
      this.context.fill();
    }

    if (rule.type === TimelineRuleType.THRESHOLD) {
      for (let i = 0; i < rule.activeHistory.length; i++) {
        const xCoord = this.getXforDay(rule.activeHistory[i]);
        this.context.strokeStyle = '#a6a6a6';
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(xCoord, yOffset + RULE_MARGINS);
        this.context.lineTo(xCoord, RULE_HEIGHT + yOffset - RULE_MARGINS);
        this.context.stroke();
      }
    }
  }

  /**
   * A function to convert a day number into an x coordingate on the timeline.
   *
   * @param {number} dayNumber The number of the day.
   * @returns {number} The x coordinate on the timeline.
   */
  getXforDay(dayNumber) {
    return (
      (dayNumber / MAXIMUM_DAYS) * (this.canvas.width - TIMELINE_X_OFFSET) +
      TIMELINE_X_OFFSET
    );
  }

  toStringList() {
    const stringList = [];
    let type = '';

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      let target = '';
      let returnedString = '';

      if (rule.type === TimelineRuleType.TIME) {
        type = 'Time';

        if (rule.target === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
          target = 'social distancing';
        } else if (rule.target === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
          target = 'attraction to center';
        }

        // const percentVal = rule.value * 100;

        returnedString = `${type} Rule: ${target} changed to ${rule.value}% from day ${rule.start} to day ${rule.end}`;
      } else if (rule.type === TimelineRuleType.THRESHOLD) {
        type = 'Threshold';
        let param = '';
        if (rule.target === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
          target = 'social distancing';
        } else if (rule.target === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
          target = 'attraction to center';
        }

        if (rule.param === 'inf') {
          param = 'infectious agents';
        } else if (rule.param === 'icu') {
          param = 'agents in the ICU';
        }

        returnedString = `${type} Rule: ${target} changed to ${rule.value}% when number of ${param} exceeds ${rule.trigger}`;
      }
      stringList.push(returnedString);
    }
    return stringList;
  }
}
