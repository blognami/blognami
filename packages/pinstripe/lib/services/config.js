
import { defineService } from 'pinstripe';

defineService('config', () => ({
    database: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pinstripe_development'
    }
}));
