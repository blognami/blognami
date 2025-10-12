
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
        this.sections = [
            {
                title: 'About',
                partial: '_sidebar/_about',
                links: [
                    { title: 'About', path: '/' }
                ],
                displayOrder: 10
            },
            {
                title: 'Posts',
                links: [
                    { title: 'All Posts', path: '/posts' },
                    { title: 'Create Post', path: '/posts/create' }
                ],
                displayOrder: 20
            }
        ];

        this.normalizeSections();

        this.sortSections();

        if(this.sections.length === 0) return;

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                ${this.sections.map(section => {
                    return this.renderView('_sidebar/_section', section);
                })}
            </aside>
        `;
    },

    normalizeSections() {
        this.sections.forEach(section => {
            if (!section.partial) {
                section.partial = '_sidebar/_links';
            }
            if (section.displayOrder === undefined) {
                section.displayOrder = 100;
            }
        });
    },

    // sortItems(items) {
    //     // assume all items have display order of 100 unless specified
    //     const defaultDisplayOrder = 100;
    //     return items.sort((a, b) => {
    //         const aDisplayOrder = a.displayOrder || defaultDisplayOrder;
    //         const bDisplayOrder = b.displayOrder || defaultDisplayOrder;
    //         return aDisplayOrder - bDisplayOrder;
    //     });   
    // }
};