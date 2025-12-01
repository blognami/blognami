export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';

        const out = await this.renderSections();

        if(isAdmin) return this.renderView('_editable_area', {
            url: "/_actions/admin/edit_site_navigation",
            body: out
        });

        return out;
    },

    async renderSections(){
        const body = this.parseHtml(
            await this.renderMarkdown(
                await this.database.site.navigation
            )
        );
        const sections = {};
        let currentSection = 'Top';
        for(const child of body.children) {
            if(child.type === 'h2') {
                currentSection = child.text;
                continue;
            }
            sections[currentSection] ??= [];
            if(child.type == 'ul'){
                sections[currentSection].push(
                    this.renderView('_navbar/burger_menu/_link_group', {
                        children: this.extractListItems(child)
                    })
                );
                continue;
            }
            sections[currentSection].push(
                this.renderHtml(child)
            );
        }
        const out = [];
        for(const [ label, body ] of Object.entries(sections)){
            out.push(
                this.renderView('_navbar/burger_menu/_section', { label, body })
            );
        }
        return out;
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