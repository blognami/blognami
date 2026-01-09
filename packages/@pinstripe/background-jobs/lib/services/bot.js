
export default {
    create(){
        return this;
    },

    async start(){
        if(this._started) return;
        this._started = true;

        await this.backgroundJobWorker.start();
        await this.backgroundJobCoordinator.start(this.backgroundJobWorker.instanceId);
    },

    async stop(){
        if(!this._started) return;
        delete this._started;

        await this.backgroundJobCoordinator.stop();
        await this.backgroundJobWorker.stop();
    },

    destroy(){
        return this.stop();
    }
};
