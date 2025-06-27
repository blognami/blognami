
export default {
    meta(){
        this.displayOrder = 200;
    },

    async render(){
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
        })
    }
}

