
export default {
    create(){
        return (name, params = {}, options = {}) => this.queueBackgroundJob(name, params, options);
    },

    async queueBackgroundJob(name, params, options){
        const {
            runAt = new Date(),
            priority = 0,
            maxAttempts = 3
        } = options;

        return this.database.backgroundJobs.insert({
            jobName: name,
            params: JSON.stringify(params),
            runAt,
            priority,
            maxAttempts,
            status: 'pending',
            source: 'programmatic'
        });
    }
};
