
import * as crypto from 'crypto';

const HEARTBEAT_INTERVAL_MS = 5000;
const LEADERSHIP_TIMEOUT_MS = 15000;

export default {
    create(){
        return this.context.root.getOrCreate("jobCoordinator", () => this);
    },

    start(){
        if(this.loop) return this.loop;

        this.coordinatorId = crypto.randomUUID();
        this.isLeader = false;

        this.jobWorker.start();

        this.loop = new Promise(async resolve => {
            while(true){
                try {
                    await this.coordinatorTick();
                } catch(e){
                    console.error('Job coordinator error:', e);
                }
                
                await this.database.destroy();

                await new Promise(resolve => setTimeout(resolve, HEARTBEAT_INTERVAL_MS));

                if(!this.loop) break;
            }

            resolve();
        });

        return this.loop;
    },

    async stop(){
        const loop = this.loop;
        delete this.loop;

        await this.jobScheduler.stop();
        await this.jobWorker.stop();

        if(this.isLeader){
            await this.releaseLeadership();
        }

        await loop;
    },

    async coordinatorTick(){
        await this.tryBecomeLeader();

        if(this.isLeader){
            this.jobScheduler.start();
            await this.sendHeartbeat();
        } else {
            await this.jobScheduler.stop();
        }

        await this.distributeJobs();
        await this.claimJob();
    },

    async tryBecomeLeader(){
        if(this.isLeader) return;

        await this.database.lock(async () => {
            const { leadJobCoordinators } = this.database;
            const lead = await leadJobCoordinators.first();

            if(!lead){
                await leadJobCoordinators.insert({
                    jobCoordinatorId: this.coordinatorId,
                    lastHeartbeatAt: new Date()
                });
                this.isLeader = true;
                return;
            }

            const now = await this.database.getUnixTimestamp();
            const lastHeartbeat = Math.floor(lead.lastHeartbeatAt.getTime() / 1000);
            const elapsed = (now - lastHeartbeat) * 1000;

            if(elapsed > LEADERSHIP_TIMEOUT_MS){
                await lead.update({
                    jobCoordinatorId: this.coordinatorId,
                    lastHeartbeatAt: new Date()
                });
                this.isLeader = true;
            }
        });
    },

    async sendHeartbeat(){
        const { leadJobCoordinators } = this.database;
        const lead = await leadJobCoordinators.first();

        if(lead && lead.jobCoordinatorId === this.coordinatorId){
            await lead.update({ lastHeartbeatAt: new Date() });
        } else {
            this.isLeader = false;
        }
    },

    async distributeJobs(){
        while(this.jobQueue.length > 1){
            const job = this.jobQueue.shift();
            if(job){
                await this.database.distributedJobs.insert({
                    name: job.name,
                    params: JSON.stringify(job.params),
                    createdAt: new Date()
                });
            }
        }
    },

    async claimJob(){
        if(this.jobQueue.length > 0) return;

        await this.database.lock(async () => {
            const { distributedJobs } = this.database;
            const job = await distributedJobs.orderBy('createdAt').first();

            if(job){
                const params = job.params ? JSON.parse(job.params) : {};
                await this.jobQueue.push(job.name, params);
                await job.delete();
            }
        });
    },

    async releaseLeadership(){
        await this.database.lock(async () => {
            const { leadJobCoordinators } = this.database;
            const lead = await leadJobCoordinators.first();

            if(lead && lead.jobCoordinatorId === this.coordinatorId){
                await lead.update({
                    jobCoordinatorId: null,
                    lastHeartbeatAt: null
                });
            }
        });
        this.isLeader = false;
    },

    destroy(){
        return this.stop();
    }
};
