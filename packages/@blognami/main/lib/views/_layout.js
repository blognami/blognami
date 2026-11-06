
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
        const { title, meta = [], body, sidebar, banner, section = 'blog' } = this.params;

        return this.renderView('_blognami/_shell', {
            meta: [
                ...(title ? [{ title }] : []),
                ...meta,
                { tagName: 'meta', name: 'blognami-default-placeholder', content: `/_placeholders/document?section=${section}` }
            ],
            body: this.renderHtml`
                <div class="${this.cssClasses.root}">
                    ${this.renderView('_header', { section: sidebar === '' ? undefined : section })}

                    ${banner}

                    ${this.renderView('_main', { body, sidebar, section })}

                    ${this.renderView('_footer')}
                </div>
            `
        });
    }
};
