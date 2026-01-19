
import { BackgroundJob } from '../background_job.js';

export default {
    create(){
        return this.context.root.getOrCreate("backgroundJobWorker", () => this);
    },

    start(){
        if(this.loop) return this.loop;

        this.loop = new Promise(async resolve => {
            while(true){
                await this.processQueue();
                await new Promise(resolve => setTimeout(resolve, 100));

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

    async processQueue(){
        let job;
        while(job = await this.backgroundJobQueue.shift()){
            try {
                await BackgroundJob.run(job.name, job.params);
            } catch(e){
                console.error(e);
            }
        }
    },

    destroy(){
        return this.stop();
    }

};
