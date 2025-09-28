
export const styles = `
    .root {
        background: yellow;
    }
`;

export default {
    async render(){
        const { body } = this.params;
        return this.renderView('_pinstripe/_shell', {
            body: this.renderHtml`
                <div class="${this.cssClasses.root}">
                    <h1>_layout.js view</h1>
                </div>
                ${body}
            `
        });
    }
};
