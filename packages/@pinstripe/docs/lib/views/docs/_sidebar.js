
export default {
    async render(){
        const docs = await this.docs;

        return this.renderHtml`
            ${this.renderView('_section', {
                title: 'Guides',
                body: this.renderHtml`
                    <ul>
                        <li><a href="/docs/guides/introduction">Introduction</a></li>
                    </ul>
                `
            })}
            ${Object.keys(docs).filter(name => Object.keys(docs[name]).length > 0).map(name => {
                const items = docs[name];

                return this.renderView('_section', {
                    title: name,
                    body: this.renderHtml`
                        <ul>
                            ${Object.values(items).map(({ name, slug })  => this.renderHtml`
                                <li><a href="/docs/${slug}">${name}</a></li>
                            `)}
                        </ul>
                    `
                });
            })}
        `
    }
}
