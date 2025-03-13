
export default {
    async render(){    
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';
    
        const site = await this.database.site;

        return this.renderView('_section', {
            title: 'About',
            testId: 'about-section',
            body: async () => {
                if(isAdmin) return this.renderView('_editable_area', {
                    url: "/_actions/admin/edit_site_description",
                    body: this.renderMarkdown(await site.description)
                });
                return this.renderMarkdown(await site.description)
            }
        });
    }
};
