export const styles = ({ colors, remify }) => `
    .thumbnail {
        display: block;
        width: ${remify(64)};
        height: ${remify(64)};
        object-fit: cover;
        border-radius: ${remify(4)};
        margin-bottom: 0.5em;
    }

    .hint {
        color: ${colors.gray[500]};
        font-size: ${remify(12)};
        margin-top: ${remify(2.5)};
    }
`;

export default {
    render(){
        const { name, label, error, hint, image, cssClasses } = this.params;

        return this.renderHtml`
            ${image ? this.renderHtml`
                <img class="${this.cssClasses.thumbnail}" src="/${image.slug}" alt="${label}" data-test-id="${name}-thumbnail">
            ` : undefined}
            <input class="${cssClasses.input}${error ? ` ${cssClasses.isError}` : ''}" name="${name}" type="file">
            ${hint ? this.renderHtml`
                <p class="${this.cssClasses.hint}">${hint}</p>
            ` : undefined}
        `;
    }
};
