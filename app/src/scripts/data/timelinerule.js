import { TIMELINE_PARAMETERS } from '../CONSTANTS';

export const TimelineRuleType = {
  TIME: 'time',
  THRESHOLD: 'threshold',
};

export class TimelineRule {
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
    if(e) { rule.oldval = e.value;} else { rule.oldval = 0;}
    return rule;
  }

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
    if(e) { rule.oldval = e.value;} else { rule.oldval = 0;}

    rule.start = 0;
    rule.end = 0;
    return rule;
  }

  reset() {
    this.activeHistory = [];
  }

  isActive(stats, time) {
    let ret = false;
    
    if(this.type === TimelineRuleType.THRESHOLD) {
      if(this.param === 'inf') {
        ret = stats.infectious >= this.trigger;
      }

      if(this.param === 'icu'){
        ret = stats.icu >= this.trigger;
      }
    } 

    else if(this.type === TimelineRuleType.TIME) {
      ret = time <= this.end && time >= this.start;
    }

    else { throw new Error("Wrong type specified"); }

    if(ret) {
      this.activeHistory.push(time);
    }

    return ret;
  }
}
