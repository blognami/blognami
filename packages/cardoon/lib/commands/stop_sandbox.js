export default {
    meta(){
        this.assignProps({
            description: 'Stops the sandbox container.'
        });
        this.tag('sandbox');
    },

    async run(){
        await this.sandbox.stop();
    }
};
