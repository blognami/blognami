
export default {
    render(){
        const that = this;

        return this.renderForm(this.database.users, {
            fields: ['name', 'email', { name: 'role', type: 'select', value: 'user', options: {
                admin: 'Admin',
                user: 'User'
            }}],
            success({ slug }){
                return that.renderRedirect({
                    url: `/${slug}`,
                    target: '_top'
                });
            }
        });
    }
};
