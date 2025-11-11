

export default {
    database: {
        adapter: process.env.DATABASE_ADAPTER || 'sqlite'
    },
    featureFlags: {
        portal: true
    }
};
