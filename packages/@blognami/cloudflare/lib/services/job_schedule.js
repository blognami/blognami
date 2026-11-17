
import cronParser from 'cron-parser';

import { Job } from 'blognami';

export default {
    create(){
        return this;
    },

    // Once per schedule however many occurrences passed: the alarm does not catch up on the runs it missed.
    findDueJobs(after, until){
        const out = [];
        for(const name of Job.names){
            for(const { crontab, params } of Job.for(name).schedules){
                if(this.findNextTime(crontab, after) <= until) out.push({ name, params });
            }
        }
        return out;
    },

    findNextOccurrence(after){
        const times = Job.names.flatMap(name => Job.for(name).schedules.map(({ crontab }) => this.findNextTime(crontab, after)));
        if(times.length) return Math.min(...times);
    },

    findNextTime(crontab, after){
        return cronParser.parseExpression(crontab, { currentDate: new Date(after) }).next().getTime();
    }
};
