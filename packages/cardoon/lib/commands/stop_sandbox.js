export default {
    meta(){
        this.assignProps({
            description: 'Stops the sandbox container.'
        });
    },

    async run(){
        await this.sandbox.stop();
    }
};
