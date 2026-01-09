
export default {
    create(){
        return (jobName, params = {}, options = {}) => this._queue(jobName, params, options);
    },

    async _queue(jobName, params, options){
        const {
            runAt = new Date(),
            priority = 0,
            maxAttempts = 3,
            tenantId = this.database.tenant?.id,
            source = 'programmatic'
        } = options;

        return this.database.withoutTenantScope.backgroundJobs.insert({
            jobName,
            params: JSON.stringify(params),
            tenantId,
            runAt,
            priority,
            status: 'pending',
            attempts: 0,
            maxAttempts,
            source
        });
    }
};
