export const styles = ({ breakpointFor, remify }) => `
    .root {
        flex: 1;
        display: flex;
        max-width: ${remify(1280)};
        margin: 0 auto;
        width: 100%;
        padding: 0 ${remify(16)};
        gap: ${remify(32)};
    }

    .content {
        flex: 1;
        padding: ${remify(16)} 0;
        max-width: ${remify(650)};
    }

    ${breakpointFor('md')} {
        .root {
            padding: 0 ${remify(24)};
        }

        .content {
            padding: ${remify(32)} 0 ${remify(32)} 0;
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