
export default {
    async render(){
        const { user, ...params } = this.params;
        let sessionUser;
        if(await this.session){
            sessionUser = await this.session.user;
        }
        
        const isAdmin = sessionUser?.role == 'admin';
        let posts = user.posts;
        if(isAdmin){
            posts = posts.orderBy('published', 'asc')
        } else {
            posts = posts.where({ published: true });
        }
        posts = posts.orderBy('publishedAt', 'desc').orderBy('title', 'asc');
    
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        
        posts = posts.paginate(1, pageSize);

        const meta = [];
        meta.push({ title: user.metaTitle || user.name });
        if(user.metaDescription) meta.push({ name: 'description', content: user.metaDescription });
    
        return this.renderView('_layout', {
            meta,
            body: this.renderHtml`
                ${this.renderView('_section', {
                    title: `Latest posts by "${user.name}"`,
                    body: async () => {
                        if(await posts.count() > 0) return this.renderView('_posts', {
                            posts,
                            loadMoreUrl: `?pageSize=${pageSize + 10}`
                        });
                        return this.renderHtml`
                            Additional posts will be published soon.
                        `;
                    }
                })}

                ${() => {
                    if(isAdmin) return this.renderHtml`
                        ${this.renderView('_editable_area', {
                            url: `/_actions/admin/edit_user_meta?id=${user.id}`,
                            body: this.renderHtml`
                                <p><b>Name:</b> ${user.name}</p>
                                <p><b>Email:</b> ${user.email}</p>
                                <p><b>Role:</b> ${user.role}</p>
                                <p><b>Membership tier:</b> ${user.membershipTier}</p>
                                <p><b>Meta title:</b> ${user.metaTitle}</p>
                                <p><b>Meta description:</b> ${user.metaDescription}</p>
                                <p><b>Slug:</b> ${user.slug}</p>
                            `,
                            linkTestId: "edit-user-meta",
                            bodyTestId: "user-meta"
                        })}

                        ${this.renderView('_danger_area', {
                            body: this.renderView('_button', {
                                tagName: 'a',
                                href: `/_actions/admin/delete_user?id=${user.id}`,
                                target: '_overlay',
                                isDangerous: true,
                                isFullWidth: true,
                                ['data-method']: 'post',
                                ['data-confirm']: 'Are you really sure you want to delete this user?',
                                ['data-test-id']: 'delete-user',
                                body: 'Delete this User!'
                            })
                        })}
                    `;
                }}
            `
        });
    }
};
