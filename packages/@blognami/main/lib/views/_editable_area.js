
export const styles = ({ colors, remify }) => `
    .root {
        border-width: ${remify(1)};
        border-style: dashed;
        border-color: ${colors.gray[700]};
    }
    .root:not(:first-child){
        margin-top: 2em;
    }
    .header {
        text-align: right;
    }
    .body, .header {
        padding: ${remify(7)};
    }
    .body > * + * {
        margin-top: ${remify(20)};
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
