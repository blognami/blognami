
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

    .section {
        margin-bottom: 3.2rem;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1.2rem;
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
                name: 'About',
                links: [
                    { name: 'About', path: '/' }
                ],
                displayOrder: 10
            },
            {
                name: 'Posts',
                links: [
                    { name: 'All Posts', path: '/posts' },
                    { name: 'Create Post', path: '/posts/create' }
                ],
                displayOrder: 20
            }
        ];

        if(this.sections.length === 0) return;

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                ${this.sections.map(section => {
                    if (section.name && section.links && section.links.length > 0) {
                        return this.renderHtml`
                            <div class="${this.cssClasses.section}">
                                <h3 class="${this.cssClasses.title}">${section.name}</h3>
                                ${this.renderView('_sidebar/_links', { links: section.links })}
                            </div>
                        `;
                    }
                    return this.renderHtml``;
                })}
            </aside>
        `;
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