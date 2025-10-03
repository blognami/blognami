
import { View } from 'pinstripe';

export const styles = `
    .root {
        width: 25.6rem;
        padding: 3.2rem 0;
        border-right: 1px solid #e5e7eb;
        position: sticky;
        top: 6.4rem;
        height: calc(100vh - 6.4rem);
        overflow-y: auto;
        padding-right: 2.4rem;
    }

    .section {
        margin-bottom: 3.2rem;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1.2rem;
    }

    .links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        display: block;
        text-decoration: none;
        color: #6b7280;
        padding: 0.6rem 0;
        font-size: 1.4rem;
        transition: color 0.2s ease;
        border-left: 2px solid transparent;
        padding-left: 1.2rem;
        margin-left: -1.2rem;
    }

    .link:hover {
        color: #111827;
    }

    .link-active {
        color: #35D0AC;
        border-left-color: #35D0AC;
        background-color: rgba(53, 208, 172, 0.05);
    }

    @media (max-width: 768px) {
        .root {
            display: none;
        }
    }
`;

export default {
    async render(){
        const items = await this.getItems();

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                <div class="${this.cssClasses.section}">
                    <h3 class="${this.cssClasses.title}">Getting Started</h3>
                    <ul class="${this.cssClasses.links}">
                        <li><a href="/docs/installation" class="${this.cssClasses.link} ${this.cssClasses.linkActive}">Installation</a></li>
                        <li><a href="/docs/quick-start" class="${this.cssClasses.link}">Quick Start</a></li>
                        <li><a href="/docs/project-structure" class="${this.cssClasses.link}">Project Structure</a></li>
                    </ul>
                </div>
                <div class="${this.cssClasses.section}">
                    <h3 class="${this.cssClasses.title}">Core Concepts</h3>
                    <ul class="${this.cssClasses.links}">
                        <li><a href="/docs/routing" class="${this.cssClasses.link}">Routing</a></li>
                        <li><a href="/docs/views" class="${this.cssClasses.link}">Views</a></li>
                        <li><a href="/docs/models" class="${this.cssClasses.link}">Models</a></li>
                        <li><a href="/docs/controllers" class="${this.cssClasses.link}">Controllers</a></li>
                    </ul>
                </div>
                <div class="${this.cssClasses.section}">
                    <h3 class="${this.cssClasses.title}">Advanced</h3>
                    <ul class="${this.cssClasses.links}">
                        <li><a href="/docs/configuration" class="${this.cssClasses.link}">Configuration</a></li>
                        <li><a href="/docs/deployment" class="${this.cssClasses.link}">Deployment</a></li>
                        <li><a href="/docs/plugins" class="${this.cssClasses.link}">Plugins</a></li>
                    </ul>
                </div>
            </aside>
        `;
    },

    async getViewsWithSidebarAnnotations(){
        let out = {};
        for(const [path, viewName] of await this.viewMap) {
            const annotations = View.for(viewName).annotations;
            if(annotations && annotations.sidebar) {
                if(out[viewName]?.path.length <= path.length) continue;
                out[viewName] = {path, ...annotations.sidebar};
            }
        }

        // Convert object to array and sort by category
        out = Object.values(out);
        out.sort((a, b) => {
            const aCategory = (a.category || []).join('>');
            const bCategory = (b.category || []).join('>');
            return aCategory.localeCompare(bCategory);
        });

        return out;
    },

    async getItems(){
        const out = { links: {} };
        const views = await this.getViewsWithSidebarAnnotations();
        for(const view of views) {
            const categories = view.category;
            let current = out;
            for(const [category, index] of Object.entries(categories)) {
                if(!current.links[category]){
                    current.links[category] = {
                        links: {}
                    };
                }
                current = current.links;
                if(index == categories.length - 1){
                    current.path = view.path;
                }
            }
        }

        function flatten(links){
            const out = [];
            for(const [name, item] of Object.entries(links || {})){
                if(item.path){
                    out.push({
                        name,
                        path: item.path,
                        links: flatten(item.links)
                    });
                }
            }
            return out;
        }
        return flatten(out.links);
    }
};