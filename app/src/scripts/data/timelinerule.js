import { TIMELINE_PARAMETERS } from "../CONSTANTS";

/**
 * Enum for different types of timeline rules.
 * @enum {String}
 */
export const TimelineRuleType = {
    TIME: "time",
    THRESHOLD: "threshold",
}

/** @class TimelineRule describing a rule on the timeline. */
export class TimelineRule 
{
    /**
     * Instantiates a TimelineRule.
     * 
     * @constructor
     * @param {TimelineRuleType} type The type of rule.
     * @param {TIMELINE_PARAMETERS} target The parameter targeted by the rule.
     */
    constructor(type, target) {
        this.type = type
        this.target = target;
        if (target === TIMELINE_PARAMETERS.SOCIAL_DISTANCING) {
            this.name = "Social distancing";
        }
        if (target === TIMELINE_PARAMETERS.ATTRACTION_TO_CENTER) {
            this.name = "Attraction to center";
        }
    }

    /**
     * A function to create a new time based rule.
     * 
     * @static
     * @param {TIMELINE_PARAMETERS} target The parameter targeted by the rule.
     * @param {number} start The starting time of the rule.
     * @param {number} end The ending time of the rule.
     * @param {number} val The value the rule sets the parameter to.
     * @param {number} oldval The old value before the rule changes the parameter.
     * @returns {TimelineRule} The resulting rule.
     */
    static newSimpleRule(target, start, end, val, oldval){
        const rule = new TimelineRule(TimelineRuleType.TIME, target);
        rule.target = target;
        rule.start = start;
        rule.end = end;
        rule.value = val;
        rule.oldval = oldval;
        return rule;
    }

    /**
     * A function to create a new threshold based rule.
     * 
     * @static
     * @param {TIMELINE_PARAMETERS} target The parameter targeted by the rule.
     * @param {TIMELINE_THRESHOLDS} param The parameter triggering the rule.
     * @param {number} trigger The boundary value of the triggering value.
     * @param {number} val The new value of the target.
     * @param {number} oldval The old value of the target.
     * @returns {TimelineRule} The resulting rule.
     */
    static newThresholdRule(target, param, trigger, val, oldval){
        const rule = new TimelineRule(TimelineRuleType.THRESHOLD, target);
        rule.param = param;
        rule.trigger = trigger;
        rule.value = val;
        rule.oldval = oldval;
        rule.start = 0;
        rule.end = 0;
        return rule;
    }

    /**
     * A function to check whether the rule is active.
     * 
     * @param {Stats} stats A stats object containing the current stats of the model.
     * @param {number} time The current time in the model.
     * @returns {Boolean} A boolean representing whether or not the rule is active.
     */
    isActive(stats, time) {
        switch(this.type) {
            case TimelineRuleType.THRESHOLD:
                switch(this.param){ 
                    case("inf"):
                        return stats.infectious >=  this.trigger;
                     case("icu"):
                        return stats.icu >= this.trigger;
                    default:
                        throw new Error("Something went terribly wrong");
                }
            case TimelineRuleType.TIME:
                return time <= this.end && time >= this.start;
            default: 
                throw new Error("Something went terribly wrong");

        }

    }
}

