export const styles = `
    .root {
        margin-bottom: 3.2rem;
    }

    .root:last-child {
        margin-bottom: 0;
    }

    .label {
        font-size: 1.4rem;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 1.6rem;
        padding-bottom: 0.8rem;
        border-bottom: 2px solid #f3f4f6;
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