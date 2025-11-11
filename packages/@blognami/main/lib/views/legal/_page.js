export default {
    async render(){
        const { title } = this.params;

        const fieldName = this.inflector.camelize(title);
        const testId = this.inflector.dasherize(title);

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';

        const content = this.renderHtml`<div data-test-id="${testId}-body">${this.renderMarkdown(await this.database.site[fieldName])}</div>`;

        return this.renderView('_layout', {
            title,
            body: this.renderHtml`
                <section>
                    ${this.renderView('_content', {
                        body: this.renderHtml`
                            <h1 data-test-id="${testId}-title">${title}</h1>
                            ${() => {
                                if(isAdmin) return this.renderView('_editable_area', {
                                    url: `/_actions/admin/edit_site_${this.inflector.snakeify(title)}`,
                                    body: content,
                                    linkTestId: `edit-${testId}-body`
                                });
                                return content;
                            }}
                        `
                    })}
                </section>
            `
        });
    } 
}