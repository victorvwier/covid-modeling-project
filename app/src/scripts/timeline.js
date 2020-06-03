import TimelineRule from './data/timelinerule';

const RULE_HEIGHT = 100;
const TIMELINE_X_OFFSET = 200;
const RULE_MARGINS = 10;

export default class Timeline {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.rules = [];
    
    this.rules.push(new TimelineRule('Social distancing', 15, 100, 5));
    this.rules.push(new TimelineRule('Social distancing', 25, 200, 5));

  }

  setTime(time) {
    this.time = time;
    this.redrawTimeline();
  }

  redrawTimeline() {
    // Set canvas to the right width
    this.canvas.height = RULE_HEIGHT * this.rules.length;

    // Draw background first
    this.context.beginPath();
    this.context.rect(TIMELINE_X_OFFSET, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'beige';
    this.context.fill();

    // Draw all the rules we have in place
    for (let i = 0; i < this.rules.length; i++) {
      this.drawRule(this.rules[i], i * RULE_HEIGHT);
    }

    // The the progress line
    const x_coord = this.getXforDay(this.time);
    this.context.strokeStyle = 'red';
    this.context.beginPath();
    this.context.moveTo(x_coord, 0);
    this.context.lineTo(x_coord, this.canvas.height);
    this.context.stroke();
  }

  drawRule(rule, y_offset) {
    const X_coords = [this.getXforDay(rule.start), this.getXforDay(rule.end)];
    this.context.font = '15px Georgia';
    this.context.fillStyle = 'black';
    this.context.fillText(rule.name, 0, y_offset + RULE_HEIGHT/2);
    this.context.beginPath();
    this.context.rect(X_coords[0], y_offset + RULE_MARGINS, X_coords[1], RULE_HEIGHT - RULE_MARGINS * 2);
    this.context.fillStyle = 'grey';
    this.context.fill();
  }

  getXforDay(dayNumber) {
    return (
      (dayNumber / (356 * 2)) * (this.canvas.width - TIMELINE_X_OFFSET) +
      TIMELINE_X_OFFSET
    );
  }
}
