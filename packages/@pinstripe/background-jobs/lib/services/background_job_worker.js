
import { Workspace } from 'pinstripe';

import { BackgroundJob } from '../background_job.js';

export default {
    create(){
        return this;
    },

    async start(){
        if(this.running) return;
        this.running = true;

        const worker = await this.database.backgroundJobWorkers.insert({
            status: 'active',
            isLeader: false,
            startedAt: new Date(),
            lastHeartbeatAt: new Date()
        });

        this.backgroundJobWorkerId = worker.id;

        this.heartbeatInterval = setInterval(() => this.updateHeartbeat(), 10000);
        this.pollLoop();
    },

    async stop(){
        if(!this.running) return;
        this.running = false;

        if(this.heartbeatInterval){
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        await this.database.backgroundJobs
            .where({ backgroundJobWorkerId: this.backgroundJobWorkerId, processing: true })
            .all()
            .then(jobs => Promise.all(jobs.map(job => job.release())));

        const worker = await this.database.backgroundJobWorkers
            .where({ id: this.backgroundJobWorkerId })
            .first();

        if(worker){
            await worker.update({ status: 'inactive', isLeader: false });
        }
    },

    async updateHeartbeat(){
        if(!this.running) return;

        const worker = await this.database.backgroundJobWorkers
            .where({ id: this.backgroundJobWorkerId })
            .first();

        if(worker){
            await worker.updateHeartbeat();
        }
    },

    async pollLoop(){
        while(this.running){
            try {
                const job = await this.claimJob();
                if(job){
                    await this.executeJob(job);
                }
            } catch(e){
                console.error('Background job worker error:', e);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    },

    async claimJob(){
        let claimedJob = null;

        await this.database.lock(async () => {
            const job = await this.database.backgroundJobs
                .where({ ready: true })
                .orderBy('priority', 'desc')
                .orderBy('runAt', 'asc')
                .first();

            if(job){
                await job.markProcessing(this.backgroundJobWorkerId);
                claimedJob = job;
            }
        });

        return claimedJob;
    },

    async executeJob(job){
        const params = JSON.parse(job.params || '{}');

        try {
            await Workspace.run(async function(){
                Object.assign(this.initialParams, params);
                await BackgroundJob.run(this.context, job.jobName);
            });

            await job.delete();
        } catch(e){
            console.error(`Background job "${job.jobName}" failed:`, e);

            if(job.attempts + 1 >= job.maxAttempts){
                await job.update({ lastError: e.message || String(e) });
                await job.delete();
            } else {
                await job.update({ lastError: e.message || String(e) });
                await job.markPending();
            }
        }
    },

    destroy(){
        return this.stop();
    }
};
