
export default {
    async create(){
        if(process.env.DATABASE_ADAPTER == 'mysql'){
            return {
                database: {
                    adapter: 'mysql',
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: `${ await this.project.config.name }_${process.env.NODE_ENV || 'development'}`
                }
            }
        }
    
        return {
            database: {
                adapter: 'sqlite',
                filename: `${ await this.project.rootPath }/${ await this.project.config.name }_${process.env.NODE_ENV || 'development'}.db`
            }
        }
    }
};
