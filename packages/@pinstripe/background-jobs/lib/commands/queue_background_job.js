
export default {
    meta(){
        this.annotate({
            description: 'Queues a background job by name for asynchronous processing.'
        });

        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the background job to queue (in snake_case).' });
    },

    async run(){
        const normalizedName = this.inflector.dasherize(this.inflector.snakeify(this.params.name));
        await this.queueBackgroundJob(normalizedName);
        console.log(`Background job "${normalizedName}" has been queued.`);
    }
};
