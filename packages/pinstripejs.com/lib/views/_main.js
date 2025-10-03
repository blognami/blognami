export const styles = `
    .root {
        flex: 1;
        display: flex;
        max-width: 1280px;
        margin: 0 auto;
        width: 100%;
        padding: 0 2.4rem;
    }

    .content {
        flex: 1;
        padding: 3.2rem 0 3.2rem 3.2rem;
        max-width: none;
    }



    @media (max-width: 768px) {
        .root {
            padding: 0 1.6rem;
        }
        
        .content {
            padding: 1.6rem 0;
        }
    }
`;

export default {
    async render(){
        const body = await this.params.body;
        
        const virtualDom = this.parseHtml(body);

        const tocLinks = [];

        virtualDom.traverse(child => {
            const id = child.attributes.id;
            if(!id) return;
            const matches = id.match(/^heading-(.*)$/);
            if(!matches) return;
            tocLinks.push({ id, title: child.text });
        });

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${this.renderView('_sidebar')}

                <main class="${this.cssClasses.content}">
                    ${this.renderView('_pinstripe/_content', { body })}
                </main>

                ${this.renderView('_toc', { links: tocLinks })}
            </div>
        `;
    }
};