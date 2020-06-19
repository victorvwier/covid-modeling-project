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
}
