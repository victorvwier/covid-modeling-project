/** @class Bounds describing the bounds of a community. */
export default class Bounds {

  /**
   * Instantiates a bounds object.
   * 
   * @constructor
   * @param {number} startX Lower bound on the X axis.
   * @param {number} endX Upper bound on the X axis.
   * @param {number} startY Lower bound on the Y axis.
   * @param {number} endY Upper bound on the Y axis.
   */
  constructor(startX, endX, startY, endY) {
    this.startX = startX;
    this.endX = endX;
    this.startY = startY;
    this.endY = endY;
  }
}
