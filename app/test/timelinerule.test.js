import { TimelineRule, TimelineRuleType } from '../src/scripts/data/timelinerule';
import { TIMELINE_PARAMETERS } from "../src/scripts/CONSTANTS";
import Stats from '../src/scripts/data/stats';

describe('TimelineRule tests', () => {
  const timelineRule = TimelineRule.newSimpleRule(TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER, 0, 100, 100, 0);
  const stats = new Stats(1, 1, 1, 1, 1);

  test('Simple time based rule', () => {
    expect(timelineRule.isActive(stats, 10)).toBe(true);
    expect(timelineRule.isActive(stats, 100)).toBe(true);
    expect(timelineRule.isActive(stats, 101)).toBe(false);
  });
});
