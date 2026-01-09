
import crypto from 'crypto';
import os from 'os';

import { BackgroundJob, Workspace } from 'pinstripe';

const JOB_POLL_INTERVAL_MS = 1000;
const HEARTBEAT_INTERVAL_MS = 10000;

export default {
    create(){
        return this;
    },

    async start(){
        if(this._running) return this._running;

        this._instanceId = crypto.randomUUID();
        this._hostname = os.hostname();
        this._pid = process.pid;

        await this._register();

        this._heartbeatInterval = setInterval(() => this._heartbeat(), HEARTBEAT_INTERVAL_MS);

        this._running = this._run();
        return this._running;
    },

    async stop(){
        const running = this._running;
        delete this._running;

        if(this._heartbeatInterval){
            clearInterval(this._heartbeatInterval);
            delete this._heartbeatInterval;
        }

        await this._deregister();
        await running;
    },

    get instanceId(){
        return this._instanceId;
    },

    async _register(){
        await Workspace.run(async function(){
            await this.database.backgroundJobWorkers.insert({
                instanceId: this._instanceId,
                hostname: this._hostname,
                pid: this._pid,
                lastHeartbeatAt: new Date(),
                isLeader: false,
                status: 'active',
                startedAt: new Date()
            });
        }.bind(this));
    },

    async _heartbeat(){
        try {
            await Workspace.run(async function(){
                await this.database.backgroundJobWorkers
                    .where({ instanceId: this._instanceId })
                    .update({ lastHeartbeatAt: new Date() });
            }.bind(this));
        } catch(e){
            console.error('Heartbeat error:', e);
        }
    },

    async _deregister(){
        try {
            await Workspace.run(async function(){
                await this.database.backgroundJobWorkers
                    .where({ instanceId: this._instanceId })
                    .update({ status: 'inactive' });
            }.bind(this));
        } catch(e){
            console.error('Deregister error:', e);
        }
    },

    async _run(){
        while(this._running){
            try {
                await this._processNextJob();
            } catch(e){
                console.error('Worker error:', e);
            }
            await new Promise(resolve => setTimeout(resolve, JOB_POLL_INTERVAL_MS));
        }
    },

    async _processNextJob(){
        await Workspace.run(async function(){
            const job = await this._claimJob();
            if(!job) return;

            await this._executeJob(job);
        }.bind(this));
    },

    async _claimJob(){
        return this.database.lock(async () => {
            const now = new Date();

            const worker = await this.database.backgroundJobWorkers
                .where({ instanceId: this._instanceId })
                .first();

            if(!worker) return null;

            const job = await this.database.withoutTenantScope.backgroundJobs
                .where({ status: 'pending', runAtLe: now })
                .orderBy('priority', 'desc')
                .orderBy('runAt', 'asc')
                .first();

            if(!job) return null;

            await job.update({
                status: 'processing',
                backgroundJobWorkerId: worker.id,
                claimedAt: now
            });

            return job;
        });
    },

    async _executeJob(queuedJob){
        try {
            const params = JSON.parse(queuedJob.params || '{}');

            if(queuedJob.tenantId){
                const tenant = await this.database.withoutTenantScope.tenants
                    .where({ id: queuedJob.tenantId }).first();

                if(tenant){
                    await tenant.runInNewWorkspace(async function(){
                        await BackgroundJob.run(this.context, queuedJob.jobName, params);
                    });
                } else {
                    throw new Error(`Tenant ${queuedJob.tenantId} not found`);
                }
            } else {
                await Workspace.run(async function(){
                    await BackgroundJob.run(this.context, queuedJob.jobName, params);
                });
            }

            await queuedJob.delete();

        } catch(error){
            console.error(`Job ${queuedJob.jobName} failed:`, error);

            const attempts = queuedJob.attempts + 1;
            const shouldRetry = attempts < queuedJob.maxAttempts;

            if(shouldRetry){
                const backoffMs = Math.pow(2, attempts) * 1000;
                await queuedJob.update({
                    status: 'pending',
                    backgroundJobWorkerId: null,
                    claimedAt: null,
                    attempts,
                    lastError: error.message,
                    runAt: new Date(Date.now() + backoffMs)
                });
            } else {
                await queuedJob.delete();
            }
        }
    },

    destroy(){
        return this.stop();
    }
};
