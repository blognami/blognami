
export const styles = `
    .root {
        width: 25.6rem;
        padding: 3.2rem 0;
        border-right: 1px solid #e5e7eb;
        position: sticky;
        top: 6.4rem;
        height: calc(100vh - 6.4rem);
        overflow-y: auto;
        padding-right: 2.4rem;
        display: flex;
        flex-direction: column;
        gap: 3.2rem;
    }

    @media (max-width: 768px) {
        .root {
            display: none;
        }
    }
`;

export default {
    async render(){
        const sections = await this.menus.sidebar || [];

        if(sections.length === 0) return;

        return this.renderHtml`
            <aside class="${this.cssClasses.root}" data-test-id="sidebar">
                ${sections.map(section => {
                    const { partial, ...restOfSection } = section;
                    return this.renderView(partial, restOfSection);
                })}
            </aside>
        `;
    }
};