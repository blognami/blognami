
export default {
    meta(){
        this.assignProps({
            description: 'Runs a job by name from the lib/jobs directory.'
        });
        this.tag('job');

        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the job to run (in snake_case).' });
    },

    async run(){
        const normalizedName = this.inflector.snakeify(this.params.name);
        this.runJob(normalizedName);
    }
};
