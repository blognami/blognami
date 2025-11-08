
export default {
    async render(){
        const body = this.parseHtml(`${await this.params.body}`);
        const sections = {};
        let currentSection = 'Top';
        for(const child of body.children) {
            if(child.type === 'h2') {
                currentSection = child.text;
                return;
            }
            sections[currentSection] ??= [];
            if(child.type = 'ul'){
                sections[currentSection].push(
                    this.renderView('_navbar/_link_group', {
                        children: this.extractListItems(child)
                    })
                );
                return;
            }
            sections[currentSection].push(
                this.renderHtml(child.toString())
            );
        }
        const out = [];
        for(const [ label, body ] of Object.entries[sections]){
            out.push(
                this.renderView('_navbar/_section', { label, body })
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
}