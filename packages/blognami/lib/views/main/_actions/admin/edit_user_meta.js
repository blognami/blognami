
export default {
    async render(){
        const that = this;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        return this.renderForm(this.database.users.where({ id: this.params.id }).first(), {
            fields: user.id == this.params.id ? ['name', 'metaTitle', 'metaDescription', 'slug'] : ['name', 'email', { name: 'role', type: 'select', options: {
                admin: 'Admin',
                user: 'User'
            }}, 'metaTitle', 'metaDescription', 'slug'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        })
    }
};
