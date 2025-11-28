export const styles = ({ colors }) => `
    .label {
        font-size: 1.4rem;
        font-weight: 600;
        color: ${colors.gray[900]};
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1.2rem;
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