
import { Job } from '../job.js';

export default {
    create(){
        return this.context.root.getOrCreate("jobWorker", () => this);
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
        while(job = await this.jobQueue.shift()){
            try {
                await Job.run(job.name, job.params);
            } catch(e){
                console.error(e);
            }
        }
    },

    destroy(){
        return this.stop();
    }

};
