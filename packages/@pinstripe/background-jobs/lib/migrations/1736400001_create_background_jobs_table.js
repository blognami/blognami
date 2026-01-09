
export default {
    async migrate(){
        await this.database.table('backgroundJobs', async backgroundJobs => {
            await backgroundJobs.addColumn('jobName', 'string', { index: true });
            await backgroundJobs.addColumn('params', 'text');
            await backgroundJobs.addColumn('tenantId', 'foreign_key');
            await backgroundJobs.addColumn('runAt', 'datetime', { index: true });
            await backgroundJobs.addColumn('priority', 'integer', { index: true, default: 0 });
            await backgroundJobs.addColumn('status', 'string', { index: true });
            await backgroundJobs.addColumn('backgroundJobWorkerId', 'foreign_key');
            await backgroundJobs.addColumn('claimedAt', 'datetime');
            await backgroundJobs.addColumn('attempts', 'integer', { default: 0 });
            await backgroundJobs.addColumn('maxAttempts', 'integer', { default: 3 });
            await backgroundJobs.addColumn('lastError', 'text');
            await backgroundJobs.addColumn('source', 'string');
        });
    }
};
