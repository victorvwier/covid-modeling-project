import { TimelineRuleType } from '../src/scripts/data/timelinerule';
import { Timeline } from '../src/scripts/timeline';
import { TIMELINE_PARAMETERS } from "../src/scripts/CONSTANTS";
import Stats from '../src/scripts/data/stats';

describe('TimelineRule tests', () => {
    
    
//     const timelineRule2 = timeline.addRule(TimelineRuleType.TIME, ["inf", 10, 100, 0]);
//     // const timelineRule3 = timeline.addRule(TIMELINE_PARAMETERS.SOCIAL_DISTANCING, ["icu", 10, 100, 0]);


 const stats1 = new Stats(1, 1, 10, 1, 1, 1);
 const stats2 = new Stats(1, 1, 100, 1, 1, 100);


const canvas = {getContext: ()=>{}, width: 600}
  
test('Simple time based rule', () => {
    const mockCallback = jest.fn(()=> {});
    const timeline = new Timeline(canvas, mockCallback, ()=>{}, ()=>{});
    timeline.addRule(TimelineRuleType.TIME, [TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER, 1, 100, 100, 0]);
    timeline.enforceRules(stats1, 0);
    timeline.enforceRules(stats1, 1);
    expect(mockCallback.mock.calls[0][0]).toBe("atc");
    expect(mockCallback.mock.calls[0][1]).toBe(0);
    expect(mockCallback.mock.calls[1][0]).toBe("atc");
    expect(mockCallback.mock.calls[1][1]).toBe(100);
  });

  test('Simple threshold based rule', () => {
    const mockCallback = jest.fn(()=> {});
    const timeline = new Timeline(canvas, mockCallback, ()=>{}, ()=>{});
    timeline.addRule(TimelineRuleType.THRESHOLD, [TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER, "icu", 10, 100, 0]);
    timeline.enforceRules(stats1, 0);
    timeline.enforceRules(stats2, 1);
    expect(mockCallback.mock.calls[0][0]).toBe("atc");
    expect(mockCallback.mock.calls[0][1]).toBe(0);
    expect(mockCallback.mock.calls[1][0]).toBe("atc");
    expect(mockCallback.mock.calls[1][1]).toBe(100);
  });

  test('Add two rules', () => {
    const mockCallback = jest.fn(()=> {});
    const timeline = new Timeline(canvas, mockCallback, ()=>{}, ()=>{});
    timeline.addRule(TimelineRuleType.THRESHOLD, [TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER, "icu", 10, 100, 0]);
    timeline.addRule(TimelineRuleType.THRESHOLD, [TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER, "icu", 100, 100, 0]);
    stats2.icu = 99;
    timeline.enforceRules(stats2, 0);
    stats2.icu += 1;
    timeline.enforceRules(stats2, 1);
    expect(mockCallback.mock.calls[0][0]).toBe("atc");
    expect(mockCallback.mock.calls[0][1]).toBe(0);
    expect(mockCallback.mock.calls[1][0]).toBe("atc");
    expect(mockCallback.mock.calls[1][1]).toBe(100);
  });
});
