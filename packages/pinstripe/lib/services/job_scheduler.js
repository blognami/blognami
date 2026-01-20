
import cronParser from 'cron-parser';

import { Job } from '../job.js';

export default {
    create(){
        return this.context.root.getOrCreate("jobScheduler", () => this);
    },

    start(){
        if(this.loop) return this.loop;

        this.loop = new Promise(async resolve => {
            let current = getUnixTime();
            while(true){
                const target = getUnixTime();
                while(current < target){
                    current++;
                    await this.scheduleJobs(current);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));

                if(!this.loop) break;
            }

            resolve();
        });

        return this.loop;
    },

    async stop(){
        const loop = this.loop;
        delete this.loop;
        await loop;
    },

    async scheduleJobs(unixTime){
        const currentDate = new Date(unixTime * 1000);
        const endDate = new Date((unixTime + 1) * 1000);
        const jobs = Job.names.map(name => Job.for(name));
        while(jobs.length){
            const job = jobs.shift();
            const schedules = [ ...job.schedules ];
            while(schedules.length){
                const { crontab, params } = schedules.shift();
                const interval = cronParser.parseExpression(crontab, {
                    currentDate,
                    endDate
                });

                if(interval.hasNext()){
                    await this.queueJob(job.name, params);
                }
            }
        }
    },

    queueJob(name, params){
        this.jobQueue.push(name, params);
    },

    destroy(){
        return this.stop();
    }

};

const getUnixTime = () => Math.floor(Date.now() / 1000);
