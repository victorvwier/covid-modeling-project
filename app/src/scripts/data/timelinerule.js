import { TIMELINE_PARAMETERS } from "../CONSTANTS";

export const TimelineRuleType = {
    TIME: "time",
    THRESHOLD: "threshold",
}

export default class TimelineRule 
{
    constructor(type, target, startTime, endTime, value) {
        this.type = type;
        this.target = target;
        this.start = startTime;
        this.end = endTime;
        this.value = value;
        

        if (target === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
            this.name = "Social distancing";
        }
        if (target === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
            this.name = "Attraction to center";
        }
    }


    isActive(time) {
        switch(this.type) {
            case TimelineRuleType.THRESHOLD:
                break;
            case TimelineRuleType.TIME:
                return time < this.end && time > this.start;
        }
    }
}

