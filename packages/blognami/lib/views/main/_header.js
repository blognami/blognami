
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
                    body: 'Find', dropdown: [
                        { href: `/_actions/admin/find_page`, target: '_overlay', body: 'Page', testId: 'find-page' },
                        { href: `/_actions/admin/find_post`, target: '_overlay', body: 'Post', testId: 'find-post'},
                        { href: `/_actions/admin/find_tag`, target: '_overlay', body: 'Tag', testId: 'find-tag'},
                        { href: `/_actions/admin/find_user`, target: '_overlay', body: 'User', testId: 'find-user'}
                    ]
                });
                links.push({
                    body: 'Add', dropdown: [
                        { href: `/_actions/admin/add_page`, target: '_overlay', body: 'Page', testId: 'add-page'},
                        { href: `/_actions/admin/add_post`, target: '_overlay', body: 'Post', testId: 'add-post'},
                        { href: `/_actions/admin/add_tag`, target: '_overlay', body: 'Tag', testId: 'add-tag'},
                        { href: `/_actions/admin/add_user`, target: '_overlay', body: 'User', testId: 'add-user'}
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
