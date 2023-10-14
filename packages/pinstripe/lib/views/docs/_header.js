
export default {
    async render(){

        return this.renderView('_navbar', {
            title: 'Pinstripe',
            links: [
                { href: '/', body: 'Home' },
                { href: '/docs/guides/introduction', body: 'Docs' },
                { href: 'https://github.com/pinstripe', target: '_blank', body: 'Github' }
            ]
        });
    }
};
