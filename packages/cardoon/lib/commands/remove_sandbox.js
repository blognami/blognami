export default {
    meta(){
        this.assignProps({
            description: 'Removes the sandbox container. The built image is left in place (use docker rmi to remove it).'
        });
        this.tag('sandbox');
    },

    async run(){
        await this.sandbox.remove();
    }
};
