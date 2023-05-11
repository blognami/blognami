
export default {
    run(){
        const { extractOptions } = this.cliUtils;

        const { app, withoutBot } = extractOptions({
            app: `main:${process.env.HOST || '127.0.0.1'}:${parseInt(process.env.PORT || '3000')}`,
            withoutBot: false
        });

        
        const apps = [];
        let currentPort = 3000;

        app.trim().split(/\s+/).forEach((app) => {
            const [name, ...serverConfig] = app.split(/:/);
            const [ port, host = '127.0.0.1'] = serverConfig.reverse();

            if(port){
                apps.push({ name, port: parseInt(port), host });
            } else {
                while(apps.filter(app => app.host == host).map(({ port }) => port).includes(currentPort)) currentPort++;
                apps.push({ name, port: currentPort, host });
            }
        });

        this.server.start(apps);

        // if(!withoutBot) this.bot.start();
    }
};
