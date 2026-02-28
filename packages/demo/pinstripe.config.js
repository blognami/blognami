

export default {
    database: {
        adapter: process.env.DATABASE_ADAPTER || 'sqlite'
    },

    googleAnalytics: {
        measurementId: process.env.GA_MEASUREMENT_ID
    },

    featureFlags(){
        const url = this.initialParams._url;
        if(url.port == '3001') return { portal: true };
        return {};
    },

    tenant(){
        const url = this.initialParams._url;
        if(url.port == '3001') return 'blognami.com';
        if(this.initialParams._headers.host == 'example.com') return;
        return this.initialParams._headers['x-host'] || 'lorum-ipsum.blognami.com';
    }
};
