
export default {
    async render(){

        return this.renderView('_navbar', {
            title: 'Blognami',
            links: [
                { href: '/', body: 'Home' },
                { href: '/docs/guides/introduction', body: 'Docs' },
                { href: 'https://github.com/blognami', target: '_blank', body: 'Github' }
            ]
        });
    }
};
