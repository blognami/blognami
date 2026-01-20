
export default {
    async migrate(){
        await this.database.table('leadJobCoordinators', async leadJobCoordinators => {
            await leadJobCoordinators.addColumn('jobCoordinatorId', 'string');
            await leadJobCoordinators.addColumn('lastHeartbeatAt', 'datetime');
        });

        await this.database.table('distributedJobs', async distributedJobs => {
            await distributedJobs.addColumn('name', 'string');
            await distributedJobs.addColumn('params', 'text');
            await distributedJobs.addColumn('createdAt', 'datetime', { index: true });
        });
    }
};
