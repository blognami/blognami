
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                ${this.renderView('_menu', {
                    items: [
                        { href: `/_actions/admin/find_page`, target: '_overlay', body: 'Page', testId: 'find-page' },
                        { href: `/_actions/admin/find_post`, target: '_overlay', body: 'Post', testId: 'find-post'},
                        { href: `/_actions/admin/find_tag`, target: '_overlay', body: 'Tag', testId: 'find-tag'},
                        { href: `/_actions/admin/find_user`, target: '_overlay', body: 'User', testId: 'find-user'}
                    ]
                })}
            </pinstripe-popover>
        `;
    }
}
