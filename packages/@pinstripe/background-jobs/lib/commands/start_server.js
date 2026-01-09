
export default {
    meta(){
        this.hasParam('withoutBackgroundJobs', {
            type: 'boolean',
            optional: true,
            description: 'Skip starting background job services.'
        });

        this.addHook('afterServerStart', 'startBackgroundJobServices');
    },

    async startBackgroundJobServices(){
        const { withoutBackgroundJobs } = this.params;
        if(withoutBackgroundJobs) return;

        await this.backgroundJobWorker.start();
        await this.backgroundJobCoordinator.start(this.backgroundJobWorker.backgroundJobWorkerId);
    }
};
