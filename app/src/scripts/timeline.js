import {TimelineRule, TimelineRuleType } from './data/timelinerule';

const RULE_HEIGHT = 100;
const TIMELINE_X_OFFSET = 200;
const RULE_MARGINS = 10;

/** @class Timeline describing a timeline on which rules can be added. */
export class Timeline {
  /**
   * Instantiates a timeline.
   * 
   * @constructor
   * @param {Object} canvas The canvas the timeline is drawn on.
   * @param {function} setruleCb A callback function to set a rule.
   */
  constructor(canvas, setruleCb) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.rules = [];
    this.setRuleCallback = setruleCb;
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

  /**
   * A function to add a rule to the timeline.
   * 
   * @param {TimelineRuleType} type The type of rule being added.
   * @param {number[]} params An array containing the parameters for the rule.
   */
  addRule(type, params){
    if(type === TimelineRuleType.TIME) {
      const rule = TimelineRule.newSimpleRule(params[0], params[1], params[2], params[3]);
      this._addRule(rule);
    }
    if(type === TimelineRuleType.THRESHOLD){
      const rule = TimelineRule.newThresholdRule(params[0], params[1], params[2], params[3]);
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
    for(let i = 0; i < this.rules.length; i++) {
      if(this.rules[i].target === rule.target) {
        found = true;
        this.rules[i] = rule;
      }
    }

    if(!found) {
      this.rules.push(rule);
    }
  }

  /**
   * A function to enforce all current rules.
   * 
   * @param {Stats} stats The current stats.
   * @param {number} time The current timestamp.
   */
  enforceRules(stats, time) {
    for(let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      if(rule.isActive(stats, time)) {
        rule.active = true;
        this.setRuleCallback(rule.target, rule.value);
      } else {
        rule.active = false;
        this.setRuleCallback(rule.target, 0);
      }
    }
  }

  /**
   * A function to redraw the timeline to be up to date.
   */
  redrawTimeline() {
    // Set canvas to the right height
    this.canvas.height = RULE_HEIGHT * this.rules.length;

    // Draw background first
    this.context.beginPath();
    this.context.rect(TIMELINE_X_OFFSET, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'beige';
    this.context.fill();

    // Draw all the rules we have in place
    for (let i = 0; i < this.rules.length; i++) {
      this.drawRule(this.rules[i], i * RULE_HEIGHT);
    }

    // The the progress line
    const xCoord = this.getXforDay(this.time);
    this.context.strokeStyle = 'red';
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
    const xCoords = [this.getXforDay(rule.start), this.getXforDay(rule.end)];
    this.context.font = '15px Georgia';
    this.context.fillStyle = 'black';

    if(rule.active){
      this.context.fillStyle = 'red';
    }
    
    this.context.fillText(`${rule.name}: ${rule.value}`, 0, yOffset + RULE_HEIGHT/2);
    this.context.beginPath();
    this.context.rect(xCoords[0], yOffset + RULE_MARGINS, xCoords[1] - xCoords[0], RULE_HEIGHT - RULE_MARGINS * 2);
    this.context.fillStyle = 'grey';
    this.context.fill();
  }

  /**
   * A function to convert a day number into an x coordingate on the timeline.
   * 
   * @param {number} dayNumber The number of the day.
   * @returns {number} The x coordinate on the timeline.
   */
  getXforDay(dayNumber) {
    return (
      (dayNumber / (356 * 2)) * (this.canvas.width - TIMELINE_X_OFFSET) +
      TIMELINE_X_OFFSET
    );
  }
}