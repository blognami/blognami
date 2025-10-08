
export default {
    meta(){
        this.annotate({
            description: 'Starts the web server and optionally the bot service.'
        });
        
        this.hasParam('host', { 
            type: 'string', 
            optional: true, 
            description: 'Host and port configuration (e.g. "127.0.0.1:3000"). Defaults to PINSTRIPE_HOST environment variable or "127.0.0.1:3000".' 
        });
        
        this.hasParam('withoutBot', { 
            type: 'boolean', 
            optional: true, 
            description: 'Skip starting the bot service.' 
        });
    },

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
