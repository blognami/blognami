
import { serviceFactory } from '../service_factory.js';

serviceFactory('config', async () => ({
    database: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pinstripe_development'
    }
}))