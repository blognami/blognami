
export default {
    render(){
        const { params } = this;
        const path = params._url.pathname;
        const prefix = path.replace(/^\/blocks\//, '');
    
        const names = this.app.viewNames
            .filter(name => name.match(/^blocks\/.+/) && name != 'blocks/default')
            .map(name => name.replace(/^blocks\//, ''))
            .filter(name => name.startsWith(prefix))
            .sort()
    
        return this.renderHtml`
            <div class="default-block">
                <p>Insert block:</p>
                <ul>
                    ${names.map(name => this.renderHtml`
                        <li data-component="blognami-markdown-editor/line-inserter" data-line-content="/${name}">${name}</li>
                    `)}
                </ul>
            </div>
        `;
    }
}
