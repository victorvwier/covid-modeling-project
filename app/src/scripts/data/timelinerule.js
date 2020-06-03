import { TIMELINE_PARAMETERS } from "../CONSTANTS";

export default class TimelineRule 
{
    constructor(type, startTime, endTime, value) {
        this.type = type;
        this.start = startTime;
        this.end = endTime;
        this.value = value;
        

        if (type === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
            this.name = "Social distancing"
        }
    }


    isActive(time) {
        return time < this.end && time > this.start;
    }
}

