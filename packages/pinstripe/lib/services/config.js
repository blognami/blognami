
let createConfigPromise;

export default {
    create(){
        return this.defer(() => {
            if(!createConfigPromise){
                createConfigPromise = (async () => ({ 
                    database: await this.createDatabaseConfig()  
                }))();
            }
            return createConfigPromise;
        });
    },

    async createDatabaseConfig(){
        const out = { adapter: 'sqlite' };

        Object.keys(process.env).forEach(name => {
            const matches = name.match(/^DATABASE_(.+)$/);
            if(!matches) return;
            const normalizedName = matches[1].toLowerCase().split(/_+/).map((s, i) => i > 0 ? s[0].toUpperCase() + s.slice(1) : s).join('');
            out[normalizedName] = process.env[name];
        });

        const { adapter } = out;

        if(adapter == 'sqlite'){
            return Object.assign({
                filename: `${await this.project.rootPath}/${process.env.NODE_ENV || 'development'}.db`
            }, out);
        }

        return Object.assign({
            host: 'localhost',
            user: 'root',
            password: '',
        }, out);
    }
};
