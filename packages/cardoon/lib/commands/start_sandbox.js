export default {
    meta(){
        this.assignProps({
            description: 'Starts the sandbox container, building the image if necessary.'
        });
    },

    async run(){
        await this.sandbox.start();
    }
};
