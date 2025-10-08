
export default {
    meta(){
        this.annotate({
            description: 'Runs a background job by name from the lib/background_jobs directory.'
        });
        
        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the background job to run (in snake_case).' });
    },

    async run(){
        const normalizedName = this.inflector.snakeify(this.params.name);
        this.runBackgroundJob(normalizedName);
    }
};
