export const styles = ({ colors, remify }) => `
    .root {
        margin-bottom: ${remify(32)};
    }

    .root:last-child {
        margin-bottom: 0;
    }

    .label {
        font-size: ${remify(14)};
        font-weight: 700;
        color: ${colors.gray[500]};
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: ${remify(16)};
        padding-bottom: ${remify(8)};
        border-bottom: ${remify(2)} solid ${colors.gray[100]};
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