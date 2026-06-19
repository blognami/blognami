
export const styles = ({ colors, shadow, remify }) => `
    .root {
        display: inline-block;
        min-width: ${remify(240)};
        max-width: 100%;
        background: ${colors.white};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(10)};
        box-shadow: ${shadow.lg};
        padding: ${remify(6)};
        font-family: system-ui, -apple-system, sans-serif;
    }
    .root > p {
        margin: 0;
        padding: ${remify(8)} ${remify(10)} ${remify(4)};
        font-size: ${remify(11)};
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: ${colors.gray[500]};
    }
    .root > ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .root > ul > li {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: ${remify(8)};
        padding: ${remify(8)} ${remify(10)};
        border-radius: ${remify(6)};
        font-size: ${remify(14)};
        color: ${colors.gray[800]};
        transition: background 0.12s ease, color 0.12s ease;
    }
    .root > ul > li::before {
        content: '/';
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: ${remify(20)};
        height: ${remify(20)};
        border-radius: ${remify(4)};
        background: ${colors.gray[100]};
        color: ${colors.gray[500]};
        font-family: monospace;
        font-size: ${remify(12)};
    }
    .root > ul > li:hover {
        background: ${colors.gray[100]};
        color: ${colors.gray[950]};
    }
    .root > ul > li:hover::before {
        background: ${colors.gray[200]};
    }
`;

export default {
    async render(){
        const { params } = this;
        const path = params._url.pathname;
        const prefix = path.replace(/^\/_markdown_slash_blocks\//, '');
    
        const names = Object.keys(await this.viewMap)
            .filter(name => name.match(/^_markdown_slash_blocks\/.+/) && name != '_markdown_slash_blocks/default')
            .map(name => name.replace(/^_markdown_slash_blocks\//, ''))
            .filter(name => name.startsWith(prefix))
            .sort()
    
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <p>Insert block</p>
                <ul>
                    ${names.map(name => this.renderHtml`
                        <li class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" data-line-content="/${name}">${name}</li>
                    `)}
                </ul>
            </div>
        `;
    }
}
