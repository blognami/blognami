
export const styles = ({ colors, remify }) => `
    .root {
        display: flex;
        align-items: center;
        gap: ${remify(12)};
        text-decoration: none;
        color: ${colors.gray[900]};
        font-weight: 600;
        font-size: ${remify(20)};
    }

    .icon {
        width: ${remify(32)};
        height: ${remify(32)};
        color: ${colors.semantic.accent};
    }
`;

export default {
    async render(){
        this.title = await this.database.site.title;

        await this.runHook('beforeRender');

        return this.renderHtml`
            <a href="/" class="${this.cssClasses.root}" data-test-id="title">
                ${this.title}
            </a>
        `;
    }
};
