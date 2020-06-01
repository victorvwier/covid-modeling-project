export default class Timeline {
  constructor(context) {
    this.context = context;
    
    this.width = 1200;
    this.height = 200;
  }

  setTime(time) {

    // Draw background first
    this.context.beginPath();
    this.context.rect(0, 0, this.width, this.height);
    this.context.fillStyle = 'beige';
    this.context.fill();
    

    // The the progress line 
    const x_coord = time / (356 * 2) * this.width;
    this.context.strokeStyle = 'red';
    this.context.beginPath();
    this.context.moveTo(x_coord, 0);
    this.context.lineTo(x_coord, this.height);
    this.context.stroke();
    
    
  }
}
