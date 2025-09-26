

import cronParser from 'cron-parser';

import { BackgroundJob } from '../background_job.js';
import { Workspace } from '../workspace.js';

export default {
    create(){
        return this;
    },
    
    start(){
        if(this.loop) return this.loop;

        this.loop = new Promise(async resolve => {
            let current = getUnixTime();
            while(true){
                const target = getUnixTime();
                while(current < target){
                    current++;
                    await this.runBackgroundJobs(current);
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

    async runBackgroundJobs(unixTime){
        const currentDate = new Date(unixTime * 1000);
        const endDate = new Date((unixTime + 1) * 1000);
        const backgroundJobs = BackgroundJob.names.map(name => BackgroundJob.for(name));
        while(backgroundJobs.length){
            const backgroundJob = backgroundJobs.shift();
            const schedules = [ ...backgroundJob.schedules ];
            while(schedules.length){
                const [ crontab, ...args ] = schedules.shift();
                const interval = cronParser.parseExpression(crontab, {
                    currentDate,
                    endDate
                }); 
                
                if(interval.hasNext()){
                    await Workspace.run(async function(){
                        try {
                            await this.runBackgroundJob(backgroundJob.name, ...args);
                        } catch(e){
                            console.error(e);
                        }
                    });
                }
            }
        }
    },
    
    destroy(){
        return this.stop();
    }

};

const getUnixTime = () => Math.floor(Date.now() / 1000);
