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

import 'nouislider/distribute/nouislider.css'; // Import styles
import wNumb from 'wnumb';
import noUiSlider from 'nouislider';
import { TimelineRuleType } from '../data/timelinerule';

export function createSingleSlider(id, start, min, max) {
  const sliderElem = document.getElementById(id);
  const slider = noUiSlider.create(sliderElem, {
    range: {
      min: min,
      max: max,
    },
    format: wNumb({
      decimals: '0',
    }),
    tooltips: [true],
    connect: true,
    start: [start],
  });

  return slider;
}

// 0 to 100

export function createDualSliders(id, min, max) {
  const sliderElem = document.getElementById(id);
  const slider = noUiSlider.create(sliderElem, {
    range: {
      min: min,
      max: max,
    },
    format: wNumb({
      decimals: '0',
    }),
    tooltips: [true, true],
    connect: true,
    start: [min, max],
  });

  return slider;
}

export function createSliders() {
  createDualSliders('timelineTimeSlider', 0, 365);
  createSingleSlider('timelineTimeValueSlider', 0, 0, 100);
  createSingleSlider('timelineform-threshold-value', 0, 0, 100);
  createSingleSlider('timelineform-threshold-trigger', 0, 0, 200);
}

// index 0 and index 1
export function getTimelineTimeSliderValues() {
  return document.getElementById('timelineTimeSlider').noUiSlider.get();
}

export function getTimelineTimeValueSliderValues() {
  return document.getElementById('timelineTimeValueSlider').noUiSlider.get();
}

export function getTimelineThresholdValueSliderValues() {
  return document
    .getElementById('timelineform-threshold-value')
    .noUiSlider.get();
}

export function getTimelineThresholdTriggerSliderValues() {
  return document
    .getElementById('timelineform-threshold-trigger')
    .noUiSlider.get();
}

export function wireTimelineButtontoTimeline(timeline) {
  document
    .getElementById('timeline-add-simple-rule')
    .addEventListener('click', () => {
      const type = document.getElementById('timelineform-simple-target').value;
      const start = getTimelineTimeSliderValues()[0];
      const end = getTimelineTimeSliderValues()[1];
      const value = getTimelineTimeValueSliderValues();
      try {
        timeline.addRule(TimelineRuleType.TIME, [
          type,
          parseFloat(start),
          parseFloat(end),
          parseFloat(value),
        ]);
        document.getElementById('timelineform-simple-feedback').innerHTML = '';
      } catch (e) {
        document.getElementById('timelineform-simple-feedback').innerHTML = e;
      }
    });

  document
    .getElementById('timeline-add-threshold-rule')
    .addEventListener('click', () => {
      const target = document.getElementById('timelineform-threshold-target')
        .value;
      const param = document.getElementById('timelineform-threshold-param')
        .value;
      const trigger = getTimelineThresholdTriggerSliderValues();
      const value = getTimelineThresholdValueSliderValues();

      try {
        timeline.addRule(TimelineRuleType.THRESHOLD, [
          target,
          param,
          parseFloat(trigger),
          parseFloat(value),
        ]);
        document.getElementById('timelineform-threshold-feedback').innerHTML =
          '';
      } catch (e) {
        document.getElementById(
          'timelineform-threshold-feedback'
        ).innerHTML = e;
      }
    });
}

export function makeUL(array, timeline) {
  // Create the list element:
  const list = document.createElement('ul');

  for (let i = 0; i < array.length; i++) {
    const item = document.createElement('li');

    item.appendChild(document.createTextNode(array[i]));

    const span = document.createElement('SPAN');
    const txt = document.createTextNode('\u00D7');
    span.className = 'close';
    span.appendChild(txt);
    span.addEventListener('click', () => timeline.deleteRule(i));
    item.appendChild(span);
    list.appendChild(item);
  }

  return list;
}

export function clearRulesList() {
  document.getElementById('rulesDIV').innerHTML = '';
}

export function setRulesList(rules, timeline) {
  document.getElementById('rulesDIV').appendChild(makeUL(rules, timeline));
}
