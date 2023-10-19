

export default {
    render(){
        return this.renderView('_layout', {
            sidebar: false,
            body: this.renderView('_hero', {
                title: this.renderHtml`
                    A <em>slick</em> CMS for Node.js
                `,
                href: '/docs/guides/introduction',
                button: 'Get Started'
            })
        });
    }
};
