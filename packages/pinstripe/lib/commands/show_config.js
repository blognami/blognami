
export default {
    meta(){
        this.annotate({
            description: 'Displays the current project configuration in JSON format.'
        });
    },

    async run(){
        console.log(JSON.stringify(await this.config, null, 2));
    }
};
