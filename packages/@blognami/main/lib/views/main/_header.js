
export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        const isSignedIn = user !== undefined;
        const isAdmin = user?.role == 'admin';
        const site = await this.database.site;

        const links = [];
        
        if(isSignedIn) {
            if(isAdmin){
                links.push({ href: '/_actions/admin/find_content', target: '_overlay', testId: 'find-content', body: 'Find' });
                links.push({ href: '/_actions/admin/add_content', target: '_overlay', testId: 'add-content', body: 'Add' });
                links.push({ href: '/_actions/admin/edit_settings', target: '_overlay', testId: 'edit-settings', body: 'Settings' });
                links.push({ href: '/_actions/admin/your_account', target: '_overlay', testId: 'your-account', body: user.name });
            } else {
                links.push({ href: '/_actions/user/your_account', target: '_overlay', testId: 'your-account', body: user.name });
            }
        } else {
            links.push({ href: '/_actions/guest/sign_in', target: '_overlay', preload: true, testId: 'sign-in', body: 'Sign in' });
        }

        return this.renderView('_navbar', {
            title: site.title,
            links,
        });
    }
};
