
export const styles = `
    .root {
        border-width: 0.1rem;
        border-style: dashed;
        border-color: var(--color-dark-gray);
    }
    .root:not(:first-child){
        margin-top: 2em;
    }
    .header {
        text-align: right;
    }
    .body, .header {
        padding: 0.7rem;
    }
    .body > * + * {
        margin-top: 2rem;
    }
`;

export default {
    render(){
        const { body, url, linkTestId, bodyTestId } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <div class="${this.cssClasses.header}">
                    <a href="${url}" target="_overlay" ${linkTestId ? this.renderHtml`data-test-id="${linkTestId}"` : ''}>Edit</a>
                </div>
                <div class="${this.cssClasses.body}" ${bodyTestId ? this.renderHtml`data-test-id="${bodyTestId}"` : ''}>
                    ${body}
                </div>
            </div>
        `;
    }
};
