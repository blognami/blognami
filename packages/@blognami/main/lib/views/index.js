export default {
    async render(){
        const home = await this.database.home;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';

        const site = await this.database.site;

        const meta = [];
        meta.push({ title: home.metaTitle || site.title });
        const description = home.metaDescription || site.description;
        if(description){
            meta.push({ name: 'description', content: description });
            meta.push({ property: 'og:description', content: description });
        }

        const body = isAdmin ? this.renderView('_tabs', {
            tabs: [
                {
                    title: 'Posts',
                    testId: 'tab-posts',
                    body: this.runHook('renderBody')
                },
                {
                    title: 'Meta',
                    testId: 'tab-meta',
                    body: this.renderView('_editable_area', {
                        url: `/_actions/admin/edit_home_meta`,
                        body: this.renderHtml`
                            <p><b>Meta title:</b> ${home.metaTitle}</p>
                            <p><b>Meta description:</b> ${home.metaDescription}</p>
                        `,
                        linkTestId: "edit-home-meta",
                        bodyTestId: "home-meta"
                    })
                }
            ]
        }) : this.runHook('renderBody');

        return this.renderView('_layout', {
            meta,
            banner: this.renderView('_cover_banner'),
            body
        });
    }
}