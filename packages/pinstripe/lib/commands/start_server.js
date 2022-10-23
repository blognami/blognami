
export default {
    run(){
        this.server.start();
    
        //TODO: be able to pass a --without-bot option
        this.bot.start();
    }
};
