export default {
    meta(){
        this.annotate({
            description: 'Displays the current project theme configuration in JSON format.'
        });
    },

    async run() {
        console.log(JSON.stringify(await this.theme, null, 2));
    },
};
