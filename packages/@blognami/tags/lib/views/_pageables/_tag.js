
export default {
    meta(){
        this.addHook('renderBody', async function(){
            const { tag } = this.params;
            let user;
            if(await this.session){
                user = await this.session.user;
            }
            
            const isAdmin = user?.role == 'admin';
        
            if(isAdmin) return this.renderHtml`
                ${this.renderView('_editable_area', {
                    url: `/_actions/admin/edit_tag_meta?id=${tag.id}`,
                    body: this.renderHtml`
                        <p><b>Name:</b> ${tag.name}</p>
                        <p><b>Meta title:</b> ${tag.metaTitle}</p>
                        <p><b>Meta description:</b> ${tag.metaDescription}</p>
                        <p><b>Slug:</b> ${tag.slug}</p>
                    `,
                    linkTestId: "edit-tag-meta",
                    bodyTestId: "tag-meta"
                })}

                ${this.renderView('_danger_area', {
                    body: this.renderView('_button', {
                        tagName: 'a',
                        href: `/_actions/admin/delete_tag?id=${tag.id}`,
                        target: '_overlay',
                        isDangerous: true,
                        isFullWidth: true,
                        ['data-method']: 'post',
                        ['data-confirm']: 'Are you really sure you want to delete this tag?',
                        ['data-test-id']: 'delete-tag',
                        body: 'Delete this Tag!'
                    })
                })}
            `.assignProps({ displayOrder: 200 });
        });
    },

    async render(){
        const { tag } = this.params;
        
        const meta = [];
        meta.push({ title: tag.metaTitle || tag.name });
        if(tag.metaDescription) meta.push({ name: 'description', content: tag.metaDescription });
    
        return this.renderView('_layout', {
            meta,
            body: this.runHook('renderBody')
        });
    }
};
