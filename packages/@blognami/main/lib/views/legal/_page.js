
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

        return this.renderView('_layout', {
            title,
            body: this.renderHtml`
                <section>
                    ${this.renderView('_article', {
                        title: title,
                        body: isAdmin ? this.renderView('_editable_area', {
                            url: `/_actions/admin/edit_site_${this.inflector.snakeify(title)}`,
                            body: this.renderView('_content', {
                                body: this.renderMarkdown(await this.database.site[fieldName]),
                                testId
                            }),
                            linkTestId: `edit-${testId}`
                        }) : this.renderView('_content', {
                            body: this.renderMarkdown(await this.database.site[fieldName]),
                            testId
                        })
                    })}
                </section>
            `
        });
    } 
}
