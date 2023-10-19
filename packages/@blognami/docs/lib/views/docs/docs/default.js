
import { escapeHtml } from 'blognami/util'

export default {
    async render(){
        const { _url, ...otherParams } = this.params;
        const docs = await this.docs;
        const matches = _url.pathname.match(/^\/docs\/([^\/]+)\/(.+)$/);
        if(!matches) return this.renderView('_404');
        const items = docs[matches[1]];
        if(!items) return this.renderView('_404');
        const item = items[matches[2]];
        if(!item) return this.renderView('_404');
        const { name, markdown } = item;
        return this.renderView('_layout', {
            body: this.renderView('_content', {
                body: this.renderHtml`
                    <h1>${this.renderHtml(escapeHtml(name).replace(/([\/_-])/g, '$1<wbr>'))} ${this.inflector.singularize(matches[1])}</h1>
                    ${this.renderMarkdown(markdown)}
                `
            })
        });
    }
};
