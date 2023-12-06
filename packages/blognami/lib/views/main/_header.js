
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
                links.push({
                    body: 'Add', dropdown: [
                        { href: `/_actions/admin/add_page?userId=${user.id}`, target: '_overlay', body: 'Page' },
                        { href: `/_actions/admin/add_post?userId=${user.id}`, target: '_overlay', body: 'Post' }
                    ]
                });
            }
            links.push({ href: '/_actions/sign_out', target: '_overlay', testId: 'sign-out', body: 'Sign out' });
        } else {
            links.push({ href: '/_actions/sign_in', target: '_overlay', preload: true, testId: 'sign-in', body: 'Sign in' });
        }

        return this.renderView('_navbar', {
            title: site.title,
            links,
        });
    }
};
