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

import {
  TimelineRuleType,
  TimelineRule,
} from '../src/scripts/data/timelinerule';
import { Timeline } from '../src/scripts/timeline';
import { TIMELINE_PARAMETERS } from '../src/scripts/CONSTANTS';
import Stats from '../src/scripts/data/stats';

describe('TimelineRule tests', () => {
  //     const timelineRule2 = timeline.addRule(TimelineRuleType.TIME, ["inf", 10, 100, 0]);
  //     // const timelineRule3 = timeline.addRule(TIMELINE_PARAMETERS.SOCIAL_DISTANCING, ["icu", 10, 100, 0]);

  const stats1 = new Stats(1, 1, 10, 1, 1, 1);
  const stats2 = new Stats(1, 1, 100, 1, 1, 100);

  const canvas = { getContext: () => {}, width: 600 };

  test('Simple time based rule', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    timeline.addRule(TimelineRuleType.TIME, [
      TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER,
      1,
      100,
      100,
      0,
    ]);
    timeline.enforceRules(stats1, 0);
    timeline.enforceRules(stats1, 1);
    expect(mockCallback.mock.calls[0][0]).toBe('atc');
    expect(mockCallback.mock.calls[1][0]).toBe('atc');
  });

  test('Simple threshold based rule', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    timeline.addRule(TimelineRuleType.THRESHOLD, [
      TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER,
      'icu',
      10,
      100,
      0,
    ]);
    timeline.enforceRules(stats1, 0);
    timeline.enforceRules(stats2, 1);
    expect(mockCallback.mock.calls[0][0]).toBe('atc');
    expect(mockCallback.mock.calls[1][0]).toBe('atc');
  });

  test('Add two rules', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    timeline.addRule(TimelineRuleType.THRESHOLD, [
      TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER,
      'icu',
      10,
      100,
      0,
    ]);
    timeline.addRule(TimelineRuleType.THRESHOLD, [
      TIMELINE_PARAMETERS.SOCIAL_DISTANCING,
      'icu',
      100,
      100,
      0,
    ]);
    stats2.icu = 99;
    timeline.enforceRules(stats2, 0);
    stats2.icu += 1;
    timeline.enforceRules(stats2, 1);
    expect(mockCallback.mock.calls[0][0]).toBe('atc');
    expect(mockCallback.mock.calls[1][0]).toBe('soc');
  });

  test('Add the same rule twice', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    const rule1 = TimelineRule.newSimpleRule(
      TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER,
      0,
      100,
      100
    );
    
    const rule2 = TimelineRule.newSimpleRule(
      TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER,
      0,
      100,
      100
    );
    timeline._addRule(rule1);
    expect(() => {timeline._addRule(rule2)}).toThrow(
      Error
    );
    expect(timeline.rules.length).toBe(1);
  });

  test('To string list time test', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    const rule1 = TimelineRule.newSimpleRule(
      TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER,
      0,
      100,
      100
    );
    const rule2 = TimelineRule.newSimpleRule(
      TIMELINE_PARAMETERS.SOCIAL_DISTANCING,
      0,
      100,
      100
    );
    timeline._addRule(rule1);
    timeline._addRule(rule2);
    expect(timeline.toStringList()[0]).toBe(
      'Time Rule: attraction to center changed to 100% from day 0 to day 100'
    );
    expect(timeline.toStringList()[1]).toBe(
      'Time Rule: social distancing changed to 100% from day 0 to day 100'
    );
  });

  test('To string list threshold test', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    const rule1 = TimelineRule.newThresholdRule(
      TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER,
      'icu',
      10,
      100
    );
    const rule2 = TimelineRule.newThresholdRule(
      TIMELINE_PARAMETERS.SOCIAL_DISTANCING,
      'icu',
      10,
      100
    );
    timeline._addRule(rule1);
    timeline._addRule(rule2);

    expect(timeline.toStringList()[0]).toBe(
      'Threshold Rule: attraction to center changed to 100% when number of agents in the ICU exceeds 10'
    );
    expect(timeline.toStringList()[1]).toBe(
      'Threshold Rule: social distancing changed to 100% when number of agents in the ICU exceeds 10'
    );
  });
  test('import presets', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    timeline.importPresetRules();
    timeline.rules.length = 2;
    expect(timeline.toStringList()[0]).toBe(
      'Time Rule: social distancing changed to 100% from day 60 to day 139'
    );
  });

  test('addPresetRuleTest time', () => {
    const mockCallback = jest.fn(() => {});
    const timeline = new Timeline(
      canvas,
      mockCallback,
      () => {},
      () => {},
      () => {}
    );
    const rule1 = { params: ['soc', 0, 100, 100], type: 'time' };
    timeline.addPresetRule(rule1);
    expect(timeline.toStringList()[0]).toBe(
      'Time Rule: social distancing changed to 100% from day 0 to day 100'
    );
  });
});
