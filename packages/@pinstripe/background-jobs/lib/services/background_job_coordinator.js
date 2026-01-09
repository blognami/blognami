
import cronParser from 'cron-parser';

import { BackgroundJob } from 'pinstripe';
import { Workspace } from 'pinstripe';

export default {
    create(){
        return this;
    },

    async start(backgroundJobWorkerId){
        if(this.running) return;
        this.running = true;
        this.backgroundJobWorkerId = backgroundJobWorkerId;

        this.leadershipInterval = setInterval(() => this.checkLeadership(), 5000);
        this.cronLoop();
    },

    async stop(){
        if(!this.running) return;
        this.running = false;

        if(this.leadershipInterval){
            clearInterval(this.leadershipInterval);
            this.leadershipInterval = null;
        }

        const worker = await this.database.backgroundJobWorkers
            .where({ id: this.backgroundJobWorkerId })
            .first();

        if(worker && worker.isLeader){
            await worker.releaseLeadership();
        }
    },

    async checkLeadership(){
        if(!this.running) return;

        await this.cleanupDeadWorkers();

        await this.database.lock(async () => {
            const currentLeader = await this.database.backgroundJobWorkers
                .leader()
                .alive()
                .first();

            if(!currentLeader){
                const worker = await this.database.backgroundJobWorkers
                    .where({ id: this.backgroundJobWorkerId })
                    .first();

                if(worker){
                    await worker.claimLeadership();
                }
            }
        });
    },

    async cleanupDeadWorkers(){
        const deadWorkers = await this.database.backgroundJobWorkers
            .active()
            .dead()
            .all();

        for(const worker of deadWorkers){
            const jobs = await worker.backgroundJobs.processing().all();
            for(const job of jobs){
                await job.release();
            }
            await worker.markDead();
        }
    },

    async cronLoop(){
        let current = getUnixTime();

        while(this.running){
            const target = getUnixTime();
            while(current < target){
                current++;
                await this.scheduleCronJobs(current);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    },

    async scheduleCronJobs(unixTime){
        const worker = await this.database.backgroundJobWorkers
            .where({ id: this.backgroundJobWorkerId })
            .first();

        if(!worker || !worker.isLeader) return;

        const currentDate = new Date(unixTime * 1000);
        const endDate = new Date((unixTime + 1) * 1000);

        for(const name of BackgroundJob.names){
            const backgroundJob = BackgroundJob.for(name);
            const { schedules, multiTenant = true, tenantsFilter = tenants => tenants } = backgroundJob;

            for(const [crontab, ...args] of schedules){
                const interval = cronParser.parseExpression(crontab, {
                    currentDate,
                    endDate
                });

                if(interval.hasNext()){
                    await this.enqueueScheduledJob(name, multiTenant, tenantsFilter);
                }
            }
        }
    },

    async enqueueScheduledJob(name, multiTenant, tenantsFilter){
        if(multiTenant){
            await Workspace.run(async function(){
                if(!await this.database.info.tenants) {
                    await this.database.backgroundJobs.insert({
                        jobName: name,
                        params: JSON.stringify({}),
                        runAt: new Date(),
                        priority: 0,
                        maxAttempts: 3,
                        status: 'pending',
                        source: 'cron'
                    });
                    return;
                }

                for(const tenant of await tenantsFilter(this.database.tenants).all()){
                    await this.database.backgroundJobs.insert({
                        jobName: name,
                        params: JSON.stringify({ _headers: { 'x-tenant-id': tenant.id } }),
                        runAt: new Date(),
                        priority: 0,
                        maxAttempts: 3,
                        status: 'pending',
                        source: 'cron'
                    });
                }
            });
        } else {
            await this.database.backgroundJobs.insert({
                jobName: name,
                params: JSON.stringify({}),
                runAt: new Date(),
                priority: 0,
                maxAttempts: 3,
                status: 'pending',
                source: 'cron'
            });
        }
    },

    destroy(){
        return this.stop();
    }
};

const getUnixTime = () => Math.floor(Date.now() / 1000);
