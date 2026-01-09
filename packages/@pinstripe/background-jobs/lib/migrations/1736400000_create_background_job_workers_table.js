
export default {
    async migrate(){
        await this.database.table('backgroundJobWorkers', async backgroundJobWorkers => {
            await backgroundJobWorkers.addColumn('instanceId', 'string', { index: true });
            await backgroundJobWorkers.addColumn('hostname', 'string');
            await backgroundJobWorkers.addColumn('pid', 'integer');
            await backgroundJobWorkers.addColumn('lastHeartbeatAt', 'datetime', { index: true });
            await backgroundJobWorkers.addColumn('isLeader', 'boolean', { index: true });
            await backgroundJobWorkers.addColumn('status', 'string', { index: true });
            await backgroundJobWorkers.addColumn('startedAt', 'datetime');
        });
    }
};
