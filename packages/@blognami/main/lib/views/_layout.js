
export const styles = `
    .root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
`;

export default {
   async render(){
        const { params } = this;
        const { meta = [], body } = params;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        return this.renderView('_pinstripe/_shell', {
            meta: [
                { name: 'pinstripe-load-cache-namespace', content: user ? 'signed-in' : 'signed-out' },
                ...meta
            ],
            body: this.renderHtml`
                <div class="${this.cssClasses.root}">
                    ${this.renderView('_navbar')}

                    ${this.renderView('_main', { body: this.params.body })}

                    ${this.renderView('_footer')}
                </div>
            `
        });
    }
};
