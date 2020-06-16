import 'nouislider/distribute/nouislider.css'; // Import styles
import wNumb from 'wnumb';
import noUiSlider from 'nouislider';
import { TimelineRuleType } from '../data/timelinerule';
import { Timeline } from '../timeline';

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
}

// index 0 and index 1
export function getTimelineTimeSliderValues() {
  return document.getElementById('timelineTimeSlider').noUiSlider.get();
}

export function getTimelineTimeValueSliderValues() {
  return (
    document.getElementById('timelineTimeValueSlider').noUiSlider.get() / 10
  );
}

export function wireTimelineButtontoTimeline(timeline) {
  document
    .getElementById('timeline-add-simple-rule')
    .addEventListener('click', () => {
      const type = document.getElementById('timelineform-simple-target').value;
      const start = getTimelineTimeSliderValues()[0];
      const end = getTimelineTimeSliderValues()[1];
      const value = getTimelineTimeValueSliderValues();
      timeline.addRule(TimelineRuleType.TIME, [
        type,
        parseFloat(start),
        parseFloat(end),
        parseFloat(value),
      ]);
    });

  document
    .getElementById('timeline-add-threshold-rule')
    .addEventListener('click', () => {
      const target = document.getElementById('timelineform-threshold-target')
        .value;
      const param = document.getElementById('timelineform-threshold-param')
        .value;
      const trigger = document.getElementById('timelineform-threshold-trigger')
        .value;
      const value = document.getElementById('timelineform-threshold-value')
        .value;
      timeline.addRule(TimelineRuleType.THRESHOLD, [
        target,
        param,
        parseFloat(trigger),
        parseFloat(value),
      ]);
    });
}

export function deleteRuleListener(index) {
  Timeline.deleteRule(index);
}

export function makeUL(array) {
  // Create the list element:
  const list = document.createElement('ul');

  for (let i = 0; i < array.length; i++) {
    const item = document.createElement('li');

    item.appendChild(document.createTextNode(array[i]));

    const span = document.createElement('SPAN');
    const txt = document.createTextNode('\u00D7');
    span.className = 'close';
    span.appendChild(txt);
    span.addEventListener('click', deleteRuleListener.bind(i));
    item.appendChild(span);
    list.appendChild(item);
  }
  return list;
}

export function clearRulesList() {
  document.getElementById('rulesDIV').innerHTML = '';
}

export function setRulesList(rules) {
  document.getElementById('rulesDIV').appendChild(makeUL(rules));
}
