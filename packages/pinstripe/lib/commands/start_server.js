
export default {
    run(){
        const {
            port = process.env.PORT || '3000',
            host = process.env.HOST || '127.0.0.1',
            withoutBot = false
        } = this.params;

        this.server.start({
            port: parseInt(port),
            host
        });

        if(!withoutBot) this.bot.start();
    }
};
