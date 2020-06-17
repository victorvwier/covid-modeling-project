import { TimelineRule, TimelineRuleType } from './data/timelinerule';
import presetsManager from './presetsManager';
import { TIMELINE_PARAMETERS } from './CONSTANTS';
import { setRulesList, clearRulesList } from './DOM/timelineDOM';

const RULE_HEIGHT = 40;
const TIMELINE_X_OFFSET = 170;
const RULE_MARGINS = 10;

function getRules() {
  return presetsManager.loadPreset().RULES;
}

export class Timeline {
  constructor(canvas, setruleCb) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.rules = [];
    this.setRuleCallback = setruleCb;
  }

  changePreset() {
    this.rules = [];
    clearRulesList();
    setRulesList(this.toStringList(this.rules), this);
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

  update(stats, time) {
    this.time = time;
    this.redrawTimeline();
    this.enforceRules(stats, time);
  }

  reset() {
    for(let i = 0; i < this.rules.length; i++) {
      this.rules[i].reset();
    }
  }

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

  _addRule(rule) {
    let found = false;
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].target === rule.target) {
        found = true;
        this.rules[i] = rule;
      }
    }

    if (!found) {
      this.rules.push(rule);
      clearRulesList();
      setRulesList(this.toStringList(this.rules), this);
    }
  }

  enforceRules(stats, time) {
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      if (rule.isActive(stats, time)) {
        rule.active = true;
        this.setRuleCallback(rule.target, rule.value);
      } else {
        rule.active = false;
        this.setRuleCallback(rule.target, 0);
      }
    }
  }

  deleteRule(index) {
    this.rules.splice(index, 1);
    clearRulesList();
    setRulesList(this.toStringList(this.rules), this);
  }

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

  drawRule(rule, yOffset) {

    // Draw the rule text
    this.context.font = '14px Roboto';
      this.context.fillStyle = 'black';

      if (rule.active) {
        this.context.font = 'bold 13px Roboto';
      }

      this.context.fillText(`${rule.name}`, 0, yOffset + RULE_HEIGHT / 3);
      this.context.fillText(
        `Value: ${rule.value}`,
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

    if(rule.type === TimelineRuleType.THRESHOLD) {
      for(let i = 0; i < rule.activeHistory.length; i++) {
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

  getXforDay(dayNumber) {
    return (
      (dayNumber / (356 * 2)) * (this.canvas.width - TIMELINE_X_OFFSET) +
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

        //const percentVal = rule.value * 100;

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

        returnedString = `${type} Rule: ${target} changed to ${rule.value} when number of ${param} exceeds ${rule.trigger}`;
      }
      stringList.push(returnedString);
    }
    return stringList;
  }
}
