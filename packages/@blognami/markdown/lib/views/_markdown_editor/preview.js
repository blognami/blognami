
export const styles = ({ colors, remify }) => `
    .root {
        color: ${colors.gray[500]};
        font-size: 0.9em;
    }
    .root p {
        margin: 0 0 ${remify(8)};
    }
    .root code {
        background: ${colors.gray[100]};
        padding: ${remify(1)} ${remify(5)};
        border-radius: ${remify(4)};
    }
`;

export default {
    meta(){
        this.addToClient();
    },

    render(){
        if((this.params.value ?? '').trim() === ''){
            return this.renderHtml`
                <div class="${this.cssClasses.root}" data-test-id="markdown-preview-empty-state">
                    <p>This is a markdown editor.</p>
                    <p>Need help? Type <code>/help</code> on a new line anytime.</p>
                </div>
            `;
        }

        return this.renderMarkdown(this.params.value, { mode: 'edit' });
    }
}
