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
  }

  static newSimpleRule(target, start, end, val, oldval) {
    const rule = new TimelineRule(TimelineRuleType.TIME, target);
    rule.target = target;
    rule.start = start;
    rule.end = end;
    rule.value = val;
    rule.oldval = oldval;
    return rule;
  }

  static newThresholdRule(target, param, trigger, val, oldval) {
    const rule = new TimelineRule(TimelineRuleType.THRESHOLD, target);
    rule.param = param;
    rule.trigger = trigger;
    rule.value = val;
    rule.oldval = oldval;
    rule.start = 0;
    rule.end = 0;
    return rule;
  }

  isActive(stats, time) {
    switch (this.type) {
      case TimelineRuleType.THRESHOLD:
        switch (this.param) {
          case 'inf':
            return stats.infectious >= this.trigger;
          case 'icu':
            return stats.icu >= this.trigger;
          default:
            throw new Error('Something went terribly wrong');
        }
      case TimelineRuleType.TIME:
        return time <= this.end && time >= this.start;
      default:
        throw new Error('Something went terribly wrong');
    }
  }
}
