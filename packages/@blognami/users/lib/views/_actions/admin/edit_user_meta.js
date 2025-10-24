
export default {
    async render(){
        const that = this;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const fields = ['name'];
        if(user.id != this.params.id) fields.push(
            'email',
            {
                name: 'role',
                type: 'select',
                options: {
                    admin: 'Admin',
                    user: 'User'
                }
            }
        );
        fields.push(
            'metaTitle',
            'metaDescription',
            'slug'
        );

        return this.renderForm(this.database.users.where({ id: this.params.id }).first(), {
            fields,
            success({ slug }){
                return that.renderRedirect({
                    url: `/${slug}`,
                    target: '_top'
                });
            }
        })
    }
};
