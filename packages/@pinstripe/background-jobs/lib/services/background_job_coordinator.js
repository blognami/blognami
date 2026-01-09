
import cronParser from 'cron-parser';

import { BackgroundJob, Workspace } from 'pinstripe';

const LEADER_CHECK_INTERVAL_MS = 5000;
const WORKER_TIMEOUT_MS = 30000;

export default {
    create(){
        return this;
    },

    async start(instanceId){
        if(this._running) return this._running;

        this._instanceId = instanceId;
        this._currentTime = getUnixTime();

        this._running = this._run();
        return this._running;
    },

    async stop(){
        const running = this._running;
        delete this._running;
        await running;
    },

    async _run(){
        while(this._running){
            try {
                const isLeader = await this._electLeader();

                if(isLeader){
                    await this._cleanupDeadWorkers();

                    const targetTime = getUnixTime();
                    while(this._currentTime < targetTime){
                        this._currentTime++;
                        await this._scheduleCronJobs(this._currentTime);
                    }
                }
            } catch(e){
                console.error('Coordinator error:', e);
            }

            await new Promise(resolve => setTimeout(resolve, LEADER_CHECK_INTERVAL_MS));
        }
    },

    async _electLeader(){
        return Workspace.run(async function(){
            return this.database.lock(async () => {
                const now = new Date();
                const timeoutThreshold = new Date(now.getTime() - WORKER_TIMEOUT_MS);

                const currentLeader = await this.database.backgroundJobWorkers
                    .where({ isLeader: true, status: 'active', lastHeartbeatAtGt: timeoutThreshold })
                    .first();

                if(currentLeader){
                    return currentLeader.instanceId === this._instanceId;
                }

                await this.database.backgroundJobWorkers
                    .where({ isLeader: true })
                    .update({ isLeader: false });

                await this.database.backgroundJobWorkers
                    .where({ instanceId: this._instanceId })
                    .update({ isLeader: true });

                console.log(`Worker ${this._instanceId} elected as leader`);
                return true;
            });
        }.bind(this));
    },

    async _cleanupDeadWorkers(){
        await Workspace.run(async function(){
            const now = new Date();
            const timeoutThreshold = new Date(now.getTime() - WORKER_TIMEOUT_MS);

            const deadWorkers = await this.database.backgroundJobWorkers
                .where({ status: 'active', lastHeartbeatAtLt: timeoutThreshold })
                .all();

            for(const deadWorker of deadWorkers){
                console.log(`Cleaning up dead worker: ${deadWorker.instanceId}`);

                await deadWorker.update({ status: 'dead', isLeader: false });

                await this.database.withoutTenantScope.backgroundJobs
                    .where({ backgroundJobWorkerId: deadWorker.id, status: 'processing' })
                    .update({
                        status: 'pending',
                        backgroundJobWorkerId: null,
                        claimedAt: null
                    });
            }
        }.bind(this));
    },

    async _scheduleCronJobs(unixTime){
        const currentDate = new Date(unixTime * 1000);
        const endDate = new Date((unixTime + 1) * 1000);

        for(const name of BackgroundJob.names){
            const backgroundJob = BackgroundJob.for(name);
            const schedules = [...backgroundJob.schedules];

            for(const [crontab] of schedules){
                const interval = cronParser.parseExpression(crontab, {
                    currentDate,
                    endDate
                });

                if(interval.hasNext()){
                    await this._queueCronJob(backgroundJob);
                }
            }
        }
    },

    async _queueCronJob(backgroundJob){
        const { multiTenant = true, tenantsFilter = tenants => tenants } = backgroundJob;

        await Workspace.run(async function(){
            const hasTenants = await this.database.info.tenants;

            if(multiTenant && hasTenants){
                for(const tenant of await tenantsFilter(this.database.tenants).all()){
                    await this.queueBackgroundJob(backgroundJob.name, {}, {
                        tenantId: tenant.id,
                        source: 'cron'
                    });
                }
            } else {
                await this.queueBackgroundJob(backgroundJob.name, {}, {
                    source: 'cron'
                });
            }
        });
    },

    destroy(){
        return this.stop();
    }
};

const getUnixTime = () => Math.floor(Date.now() / 1000);
