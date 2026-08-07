
export default {
    create(){
        return this.context.root.getOrCreate("jobCoordinator", () => this);
    },

    start(){
        this.jobScheduler.start();
        this.jobWorker.start();
    },

    async stop(){
        await this.jobScheduler.stop();
        await this.jobWorker.stop();
    },

    destroy(){
        return this.stop();
    }
};
