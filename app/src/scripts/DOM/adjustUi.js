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

/* eslint-disable prefer-template */
export default class {
  static makeLeftAndRightPanelSameHeight() {
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-side-container');

    if (leftPanel.clientHeight > rightPanel.clientHeight) {
      rightPanel.style.height = leftPanel.clientHeight + 'px';
    } else {
      leftPanel.style.height = rightPanel.clientHeight + 'px';
    }
  }

  static fixTooltipsOverflowing() {
    [...document.getElementsByClassName('tooltip-text')].forEach((textEl) => {
      const { left, right } = textEl.getBoundingClientRect();
      if (right > window.innerWidth) {
        const diff = right - window.innerWidth;
        const half = diff / 2;
        textEl.style.right = -half + 'px';
      }
      // TODO maybe check for overflow from the left?
    });
  }
}
