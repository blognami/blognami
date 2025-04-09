
export default {
    render(){
        const that = this;

        return this.renderForm(this.database.users, {
            fields: ['name', 'email', { name: 'role', type: 'select', value: 'user', options: {
                admin: 'Admin',
                user: 'User'
            }}],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        });
    }
};
