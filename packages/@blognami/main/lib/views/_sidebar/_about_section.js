
export default {
    async render(){    
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';
    
        const site = await this.database.site;

        let body = await this.renderMarkdown(await site.description);
        
        const parsedBody = this.parseHtml(body);

        for(const [index, child] of Object.entries(parsedBody.children)) {
            if(child.type != 'ul') continue;
            const children = this.extractListItems(child);
            const html = await this.renderView('_sidebar/_link_group_section', { children });
            parsedBody.children[index] = this.parseHtml(html);
            parsedBody.children[index].parent = parsedBody;
        }

        body = await this.renderHtml(parsedBody.toString());

        return this.renderView('_sidebar/_section', {
            label: 'About',
            testId: 'about-section',
            body: async () => {
                if(isAdmin) return this.renderView('_editable_area', {
                    url: "/_actions/admin/edit_site_description",
                    body
                });
                return body;
            }
        });
    },

    extractListItems(ul) {
        const out = [];
        for(const li of ul.children) {
            if(li.type !== 'li') continue;

            const item = {};

            const a = li.children.find(c => c.type === 'a');
            if(a){
                item.label = a.children.map(c => c.type === '#text' ? c.attributes.value : '').join('').trim();
                item.url = a.attributes.href;
            } else {
                item.label = li.children.map(c => c.type === '#text' ? c.attributes.value : '').join('').trim();
            }

            const children = [];

            for(const child of li.children) {
                if(child.type !== 'ul') continue;
                children.push(...this.extractListItems(child));
            }

            if(children.length) item.children = children;

            out.push(item);
        }
        return out;
    }

};
