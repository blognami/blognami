
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
    }

    @media (max-width: 768px) {
        .root {
            display: none;
        }
    }
`;

export default {
    async render(){
        const sections = this.menus.sidebar || [];

        this.normalizeSections(sections);

        if(sections.length === 0) return;

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                ${sections.map(section => {
                    return this.renderView('_sidebar/_section', section);
                })}
            </aside>
        `;
    },

    normalizeSections(sections) {
        sections.forEach(section => {
            if (!section.partial) {
                section.partial = '_sidebar/_links';
            }
            if (section.children) {
                this.normalizeSections(section.children);
            }
        });
    }
};