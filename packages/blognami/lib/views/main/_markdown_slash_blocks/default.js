
export const styles = `
    .root {
        border-width: 0.1rem;
        border-style: dashed;
        padding: 1em;
    }
    .root > ul > li {
        cursor: pointer;
    }
`;

export default {
    render(){
        const { params } = this;
        const path = params._url.pathname;
        const prefix = path.replace(/^\/_markdown_slash_blocks\//, '');
    
        const names = this.app.viewNames
            .filter(name => name.match(/^_markdown_slash_blocks\/.+/) && name != '_markdown_slash_blocks/default')
            .map(name => name.replace(/^_markdown_slash_blocks\//, ''))
            .filter(name => name.startsWith(prefix))
            .sort()
    
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <p>Insert block:</p>
                <ul>
                    ${names.map(name => this.renderHtml`
                        <li class="${this.cssClassesFor('main/_markdown_editor/modal').lineInserter}" data-line-content="/${name}">${name}</li>
                    `)}
                </ul>
            </div>
        `;
    }
}
