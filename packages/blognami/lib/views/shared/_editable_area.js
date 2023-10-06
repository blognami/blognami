
export default {
    styles: `
        .root {
            border-width: 0.1rem;
            border-style: dashed;
            border-color: var(--color-dark-gray);
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
    `,
    
    render(){
        const { body, url, testId } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <div class="${this.cssClasses.header}">
                    <a href="${url}" target="_overlay" ${testId ? this.renderHtml`data-test-id="${testId}"` : ''}>Edit</a>
                </div>
                <div class="${this.cssClasses.body}">
                    ${body}
                </div>
            </div>
        `;
    }
};
