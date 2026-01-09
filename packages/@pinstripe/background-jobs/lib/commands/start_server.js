
export default {
    meta(){
        this.addHook('afterServerStart', 'startBot');
    },

    startBot(){
        if(!this.params.withoutBot){
            this.bot.start();
        }
    }
};
