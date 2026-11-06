export const styles = ({ colors, remify }) => `
    .hint {
        color: ${colors.gray[500]};
        font-size: ${remify(12)};
        margin-top: ${remify(2.5)};
    }
`;

export default {
    render(){
        const { name, value, error, hint, cssClasses } = this.params;

        return this.renderHtml`
            <input class="${cssClasses.input}${error ? ` ${cssClasses.isError}` : ''}" name="${name}" type="text" value="${value}">
            ${hint ? this.renderHtml`
                <p class="${this.cssClasses.hint}">${hint}</p>
            ` : undefined}
        `;
    }
};
