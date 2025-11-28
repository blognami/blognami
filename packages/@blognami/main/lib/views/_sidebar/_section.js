export const styles = ({ colors, remify }) => `
    .label {
        font-size: ${remify(14)};
        font-weight: 600;
        color: ${colors.gray[900]};
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: ${remify(12)};
    }
`;

export default {
    render(){
        const { label, body, testId } = this.params;
        
        return this.renderHtml`
            <div class="${this.cssClasses.root}" ${testId ? this.renderHtml`data-test-id="${testId}"` : ''}>
                <h2 class="${this.cssClasses.label}">${label}</h2>
                ${body}
            </div>
        `;
    }
};