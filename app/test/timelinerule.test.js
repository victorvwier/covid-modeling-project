import { TimelineRule } from '../src/scripts/data/timelinerule';
import { TIMELINE_PARAMETERS } from "../src/scripts/CONSTANTS";
import Stats from '../src/scripts/data/stats';

describe('TimelineRule tests', () => {
  const timelineRule1 = TimelineRule.newSimpleRule(TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER, 0, 100, 100, 0);
  const timelineRule2 = TimelineRule.newThresholdRule(TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER, "inf", 10, 100, 0);
  const timelineRule3 = TimelineRule.newThresholdRule(TIMELINE_PARAMETERS.SOCIAL_DISTANCING, "icu", 10, 100, 0);


  const stats1 = new Stats(1, 1, 1, 1, 1, 1);
  const stats2 = new Stats(1, 1, 100, 1, 1, 100);


  test('Simple time based rule', () => {
    expect(timelineRule1.isActive(stats1, 10)).toBe(true);
    expect(timelineRule1.isActive(stats1, 100)).toBe(true);
    expect(timelineRule1.isActive(stats1, 101)).toBe(false);
  });

  test('Threshold1 time based rule', () => {
    expect(timelineRule2.isActive(stats1, 10)).toBe(false);
    expect(timelineRule2.isActive(stats2, 100)).toBe(true);
    expect(timelineRule2.isActive(stats2, 101)).toBe(true);
  });
  
  test('Threshold2 time based rule', () => {
    expect(timelineRule3.isActive(stats1, 10)).toBe(false);
    expect(timelineRule3.isActive(stats2, 100)).toBe(true);
    expect(timelineRule3.isActive(stats2, 101)).toBe(true);
  });

  test('Wrong parameter target error', () => {
    const timelineRule4 = TimelineRule.newSimpleRule("error", 0, 100, 100, 0);
    timelineRule4.type = "error";
    expect(() => {timelineRule4.isActive(stats1, 100)}).toThrow();
  });
});
