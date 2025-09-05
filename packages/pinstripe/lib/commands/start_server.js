
export default {
    run(){
        const {
            host = process.env.PINSTRIPE_HOST || '127.0.0.1:3000',
            withoutBot = false
        } = this.params;

        for(let pair of host.trim().split(/\s+/)){
            const matches = pair.match(/^([^:]+):(\d+)$/);
            const hostname = matches ? matches[1] : host;
            const port = matches ? matches[2] : port;

            this.server.start({
                port: parseInt(port),
                hostname
            });
        }

        if(!withoutBot) this.bot.start();
    }
};
