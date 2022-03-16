
export default async ({ project }) => {
    if(process.env.DATABASE_ADAPTER == 'mysql'){
        return {
            database: {
                adapter: 'mysql',
                host: 'localhost',
                user: 'root',
                password: '',
                database: `${ await project.config.name }_${process.env.NODE_ENV || 'development'}`
            }
        }
    }

    return {
        database: {
            adapter: 'sqlite',
            filename: `${ await project.rootPath }/${ await project.config.name }_${process.env.NODE_ENV || 'development'}.db`
        }
    }
};
