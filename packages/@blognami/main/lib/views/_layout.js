
export const styles = ({ colors }) => `
    .root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: ${colors.gray[700]};
        background-color: ${colors.white};
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
`;

export default {
   async render(){
        const { meta = [], body } = this.params;

        const url = this.initialParams._url;
        const canonicalMeta = [];
        if (url) {
            const tenant = await this.database.tenant;
            const canonicalHost = tenant ? tenant.host : url.hostname;
            const canonicalUrl = `${url.protocol}//${canonicalHost}${url.pathname}`;
            canonicalMeta.push({ tagName: 'link', rel: 'canonical', href: canonicalUrl });
        }

        return this.renderView('_pinstripe/_shell', {
            meta: [
                ...canonicalMeta,
                ...meta
            ],
            body: this.renderHtml`
                <div class="${this.cssClasses.root}">
                    ${this.renderView('_header')}

                    ${this.renderView('_main', { body })}

                    ${this.renderView('_footer')}
                </div>
            `
        });
    }
};
