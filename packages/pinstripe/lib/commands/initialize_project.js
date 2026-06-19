
export default {
    meta(){
        this.tag('core');
    },

    async run(){
        await this.runHook('run');
    }
};
