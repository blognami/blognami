
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
        const body = await this.parseHtml(
            await this.renderMarkdown(
                await this.database.site.navigation
            )
        );
        const sections = {};
        const counts = {};
        let currentSection = 'Top';
        for(const child of body.children) {
            if(child.type === 'h2') {
                currentSection = child.text;
                continue;
            }
            sections[currentSection] ??= [];
            if(child.type == 'ul'){
                const items = this.extractListItems(child);
                counts[currentSection] = (counts[currentSection] || 0) + this.countLinks(items);
                sections[currentSection].push(
                    this.renderView('_sidebar/_link_group', {
                        children: items
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
                this.renderView('_sidebar/_section', {
                    label,
                    testId: this.inflector.dasherize(label),
                    count: counts[label],
                    body
                })
            );
        }
        return out;
    },

    countLinks(items){
        return (items || []).reduce(
            (total, item) => total + (item.url ? 1 : 0) + this.countLinks(item.children), 0
        );
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
                if(a.attributes['data-placeholder']) item.placeholder = a.attributes['data-placeholder'];
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