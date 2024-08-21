
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                ${this.renderView('_menu', {
                    items: [
                        { href: `/_actions/admin/add_page`, target: '_overlay', body: 'Page', testId: 'add-page'},
                        { href: `/_actions/admin/add_post`, target: '_overlay', body: 'Post', testId: 'add-post'},
                        { href: `/_actions/admin/add_tag`, target: '_overlay', body: 'Tag', testId: 'add-tag'},
                        { href: `/_actions/admin/add_user`, target: '_overlay', body: 'User', testId: 'add-user'}
                    ]
                })}
            </pinstripe-popover>
        `;
    }
}
