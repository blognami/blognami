export const styles = `
    .aboutContent {
        color: #4b5563;
        font-size: 1.4rem;
        line-height: 1.6;
        margin: 0;
    }

    .aboutContent p {
        margin: 0 0 1.6rem 0;
    }

    .aboutContent p:last-child {
        margin-bottom: 0;
    }

    .aboutContent a {
        color: #374151;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .aboutContent a:hover {
        color: #1f2937;
        text-decoration: underline;
    }
`;

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
            const html = await this.renderView('_navbar/burger_menu/_link_group', { children });
            parsedBody.children[index] = this.parseHtml(html);
            parsedBody.children[index].parent = parsedBody;
        }

        body = await this.renderHtml(parsedBody.toString());

        const wrappedContent = this.renderHtml`<div class="${this.cssClasses.aboutContent}">${body}</div>`;

        return this.renderView('_navbar/burger_menu/_section', {
            label: 'About',
            testId: 'about-section',
            body: async () => {
                if(isAdmin) return this.renderView('_editable_area', {
                    url: "/_actions/admin/edit_site_description",
                    body: wrappedContent
                });
                return wrappedContent;
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
                item.target = '_top';
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