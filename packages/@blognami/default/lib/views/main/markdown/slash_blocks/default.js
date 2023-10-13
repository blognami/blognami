
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
        const prefix = path.replace(/^\/markdown\/slash_blocks\//, '');
    
        const names = this.app.viewNames
            .filter(name => name.match(/^markdown\/slash_blocks\/.+/) && name != 'markdown/slash_blocks/default')
            .map(name => name.replace(/^markdown\/slash_blocks\//, ''))
            .filter(name => name.startsWith(prefix))
            .sort()
    
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <p>Insert block:</p>
                <ul>
                    ${names.map(name => this.renderHtml`
                        <li class="${this.cssClassesFor('main/markdown/editor').lineInserter}" data-line-content="/${name}">${name}</li>
                    `)}
                </ul>
            </div>
        `;
    }
}
