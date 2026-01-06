

export default {
    database: {
        adapter: process.env.DATABASE_ADAPTER || 'sqlite'
    },

    featureFlags(){
        const url = this.initialParams._url;
        if(url.port == '3001') return { portal: true };
        return {};
    },

    tenant(){
        const url = this.initialParams._url;
        if(url.port == '3001') return 'portal';
        if(this.initialParams._headers.host == 'example.com') return;
        return this.initialParams._headers['x-tenant'] || 'lorum-ipsum';
    },

    stripe: {
        productId: 'prod_TjS2bQ7tQwQbLi'
    }
};
