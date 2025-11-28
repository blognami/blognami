export const styles = ({ breakpointFor }) => `
    .root {
        flex: 1;
        display: flex;
        max-width: 1280px;
        margin: 0 auto;
        width: 100%;
        padding: 0 1.6rem;
        gap: 3.2rem;
    }

    .content {
        flex: 1;
        padding: 1.6rem 0;
        max-width: 650px;
    }

    ${breakpointFor('md')} {
        .root {
            padding: 0 2.4rem;
        }

        .content {
            padding: 3.2rem 0 3.2rem 0;
        }
    }
`;

export default {
    async render(){
        const body = await this.params.body;
        
        const virtualDom = this.parseHtml(body);

        const tocLinks = [];

        virtualDom.traverse(child => {
            const matches = child.type.match(/^h([2-3])$/)
            if(!matches) return;
            const level = parseInt(matches[1]);
            const id = child.attributes.id;
            if(!id) return;
            if(level === 2) {
                tocLinks.push({ id, title: child.text, links: [] });
                return;
            }
            if(level === 3 && tocLinks.length > 0) {
                tocLinks[tocLinks.length - 1].links.push({ id, title: child.text });
                return;
            }
        });

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${this.renderView('_sidebar')}

                <main class="${this.cssClasses.content}" data-test-id="main">
                    ${body}
                </main>

                ${this.renderView('_toc', { links: tocLinks })}
            </div>
        `;
    }
};