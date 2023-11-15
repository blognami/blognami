
export default {
    async render(){

        const path = this.initialParams._url.pathname;

        return this.renderView('_navbar', {
            logoUrl: '/assets/images/logo.svg',
            title: 'Pinstripe',
            links: [
                { href: '/', body: 'Home', selected: path == '/' },
                { href: '/docs/guides/introduction', body: 'Docs', selected: path.startsWith('/docs') },
                { href: 'https://github.com/pinstripe', target: '_blank', body: 'Github' }
            ]
        });
    }
};
