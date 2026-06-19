export default {
    meta(){
        this.assignProps({
            description: 'Displays the current project theme configuration in JSON format.'
        });
        this.tag('core');
    },

    async run() {
        console.log(JSON.stringify(await this.theme, null, 2));
    },
};
