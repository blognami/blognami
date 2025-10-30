
export const styles = `
    .root {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        text-decoration: none;
        color: #111827;
        font-weight: 600;
        font-size: 2rem;
    }

    .icon {
        width: 3.2rem;
        height: 3.2rem;
        color: #35D0AC;
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
