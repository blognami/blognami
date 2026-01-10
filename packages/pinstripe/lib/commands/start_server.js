
export default {
    meta(){
        this.annotate({
            description: 'Starts the web server.'
        });

        this.hasParam('host', {
            type: 'string',
            optional: true,
            description: 'Host and port configuration (e.g. "127.0.0.1:3000"). Defaults to PINSTRIPE_HOST environment variable or "127.0.0.1:3000".'
        });
    },

    async run(){
        await this.runHook('beforeServerStart');

        const { host = process.env.PINSTRIPE_HOST || '127.0.0.1:3000' } = this.params;

        for(let pair of host.trim().split(/\s+/)){
            const matches = pair.match(/^([^:]+):(\d+)$/);
            const hostname = matches ? matches[1] : host;
            const port = matches ? matches[2] : port;

            this.server.start({
                port: parseInt(port),
                hostname
            });
        }

        await this.runHook('afterServerStart');

        // Keep the command running to prevent context destruction.
        // This ensures the database connection stays alive for background services.
        await new Promise((resolve) => {
            const shutdown = async () => {
                await this.runHook('beforeServerStop');
                await this.server.stop();
                resolve();
            };
            process.on('SIGINT', shutdown);
            process.on('SIGTERM', shutdown);
        });
    }
};
