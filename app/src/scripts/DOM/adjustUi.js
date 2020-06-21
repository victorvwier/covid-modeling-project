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
