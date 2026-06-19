
export default {
    meta(){
        this.assignProps({
            description: 'Displays the current project configuration in JSON format.'
        });
        this.tag('core');
    },

    async run(){
        console.log(JSON.stringify(await this.config, null, 2));
    }
};
