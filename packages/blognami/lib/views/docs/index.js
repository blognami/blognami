
export default {
    render(){
        return this.renderView('_layout', {
            showSidebar: false,
            body: this.renderHtml`
                <div class="home-hero">
                    <h1 class="home-hero-title">A <em>slick</em> CMS for Node.js</h1>
                    <a class="home-hero-button" href="/docs/guides/introduction">Get Started</a>
                </div>
            `
        });
    }
};
