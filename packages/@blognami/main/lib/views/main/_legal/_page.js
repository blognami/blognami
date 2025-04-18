
export const styles = `
    .article {
        max-width: 650px;
        margin: 0 auto 0 auto;
    }
    
    .header {
        margin-bottom: 4rem;
    }

    .title {
        font-size: 7.4rem;
        font-weight: 600;
        line-height: 1;
    }
`;

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
                    <article class="${this.cssClasses.article}">
                        <header class="${this.cssClasses.header}">
                            <h1>${title}</h1>
                        </header>
                        ${async () => {
                            if(isAdmin) return this.renderView('_editable_area', {
                                url: `/_actions/admin/edit_site_${this.inflector.snakeify(title)}`,
                                body:  this.renderView('_content', {
                                    body: this.renderMarkdown(await this.database.site[fieldName]),
                                    testId
                                }),
                                linkTestId: `edit-${testId}`
                            });
                            return this.renderView('_content', {
                                body: this.renderMarkdown(await this.database.site[fieldName]),
                                testId
                            });
                        }}
                    </article>
                </section>
            `
        });
    } 
}
