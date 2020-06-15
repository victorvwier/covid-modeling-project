import TimelineRule, { TimelineRuleType } from './data/timelinerule';
import {TIMELINE_PARAMETERS} from './CONSTANTS';
const RULE_HEIGHT = 100;
const TIMELINE_X_OFFSET = 200;
const RULE_MARGINS = 10;

export default class Timeline {
  constructor(canvas, setruleCb) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.rules = [];
    this.setRuleCallback = setruleCb;
  }

  update(stats, time) {
    this.time = time;
    this.redrawTimeline();
    this.enforceRules(stats, time);
  }

  addRule(type, params){
    if(type === TimelineRuleType.TIME) {
      const rule = TimelineRule.newSimpleRule(params[0], params[1], params[2], params[3]);
      this._addRule(rule);
    }
    if(type === TimelineRuleType.THRESHOLD){
      const rule = TimelineRule.newThresholdRule(params[0], params[1], params[2], params[3])

      this._addRule(rule);
    }
  }

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
    const x_coord = this.getXforDay(this.time);
    this.context.strokeStyle = 'red';
    this.context.beginPath();
    this.context.moveTo(x_coord, 0);
    this.context.lineTo(x_coord, this.canvas.height);
    this.context.stroke();
  }

  drawRule(rule, y_offset) {
    const X_coords = [this.getXforDay(rule.start), this.getXforDay(rule.end)];
    this.context.font = '15px Georgia';
    this.context.fillStyle = 'black';

    if(rule.active){
      this.context.fillStyle = 'red';
    }
    
    this.context.fillText(`${rule.name}: ${rule.value}`, 0, y_offset + RULE_HEIGHT/2);
    this.context.beginPath();
    this.context.rect(X_coords[0], y_offset + RULE_MARGINS, X_coords[1] - X_coords[0], RULE_HEIGHT - RULE_MARGINS * 2);
    this.context.fillStyle = 'grey';
    this.context.fill();
  }

  getXforDay(dayNumber) {
    return (
      (dayNumber / (356 * 2)) * (this.canvas.width - TIMELINE_X_OFFSET) +
      TIMELINE_X_OFFSET
    );
  }
}