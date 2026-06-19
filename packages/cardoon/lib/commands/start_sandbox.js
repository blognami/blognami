export default {
    meta(){
        this.assignProps({
            description: 'Starts the sandbox container, building the image if necessary.'
        });
        this.tag('sandbox');
    },

    async run(){
        await this.sandbox.start();
    }
};
