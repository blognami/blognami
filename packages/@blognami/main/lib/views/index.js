export default {
    meta(){
        this.addHook('renderBody', async function(){
            let user;
            if(await this.session){
                user = await this.session.user;
            }

            const isAdmin = user?.role == 'admin';

            const home = await this.database.home;
        
            if(isAdmin) return this.renderView('_editable_area', {
                url: `/_actions/admin/edit_home_meta`,
                body: this.renderHtml`
                    <p><b>Meta title:</b> ${home.metaTitle}</p>
                    <p><b>Meta description:</b> ${home.metaDescription}</p>
                `,
                linkTestId: "edit-home-meta",
                bodyTestId: "home-meta"
            }).assignProps({ displayOrder: 200 });
        });
    },

    async render(){
        const home = await this.database.home;

        const meta = [];
        meta.push({ title: home.metaTitle || await this.database.site.title });
        if(home.metaDescription) meta.push({ name: 'description', content: home.metaDescription });
    
        return this.renderView('_layout', {
            meta,
            body: this.runHook('renderBody')
        });
    }
}