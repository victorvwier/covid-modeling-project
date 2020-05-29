export default class Timeline {

    constructor(label) {
      this.label = label;
    }

    setTime(time) {
        this.label.innerHTML = `${Math.round(time)} days`
    }
  
}