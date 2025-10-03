
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
        const linksHtml = await this.renderLinks(items);

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                ${linksHtml}
            </aside>
        `;
    },

    async renderLinks(links, level = 0){
        if (!links || links.length === 0) {
            return this.renderHtml``;
        }

        return this.renderHtml`${links.map(link => {
            // For level 0, create sections with h3 titles
            if (level === 0 && link.name && link.links && link.links.length > 0) {
                return this.renderHtml`
                    <div class="${this.cssClasses.section}">
                        <h3 class="${this.cssClasses.title}">${link.name}</h3>
                        <ul class="${this.cssClasses.links}">
                            ${link.links.map(childLink => {
                                const isActive = this.initialParams._url.pathname === childLink.path;
                                const activeClass = isActive ? this.renderHtml` ${this.cssClasses.linkActive}` : '';
                                
                                return this.renderHtml`
                                    <li>
                                        ${childLink.path 
                                            ? this.renderHtml`<a href="${childLink.path}" class="${this.cssClasses.link}${activeClass}">${childLink.name}</a>`
                                            : this.renderHtml`<span class="${this.cssClasses.link}">${childLink.name}</span>`
                                        }
                                        ${childLink.links && childLink.links.length > 0 
                                            ? this.renderLinks(childLink.links, level + 1)
                                            : ''
                                        }
                                    </li>
                                `;
                            })}
                        </ul>
                    </div>
                `;
            }
            // For deeper levels, just render as nested list items
            else if (level > 0) {
                const isActive = this.initialParams._url.pathname === link.path;
                const activeClass = isActive ? this.renderHtml` ${this.cssClasses.linkActive}` : '';
                
                return this.renderHtml`
                    <li>
                        ${link.path 
                            ? this.renderHtml`<a href="${link.path}" class="${this.cssClasses.link}${activeClass}">${link.name}</a>`
                            : this.renderHtml`<span class="${this.cssClasses.link}">${link.name}</span>`
                        }
                        ${link.links && link.links.length > 0 
                            ? this.renderHtml`
                                <ul class="${this.cssClasses.links}">
                                    ${this.renderLinks(link.links, level + 1)}
                                </ul>
                            `
                            : ''
                        }
                    </li>
                `;
            }
            return this.renderHtml``;
        })}`;
    },

    async getViewsWithSidebarAnnotations(){
        let out = {};
        const viewMap = await this.viewMap;
        for(const [path, viewName] of Object.entries(viewMap)) {
            const annotations = View.for(viewName).annotations;
            if(annotations && annotations.sidebar) {
                if(out[viewName]?.path.length <= path.length) continue;
                out[viewName] = {path: `/${path}`.replace(/\/index$/, '') || '/', ...annotations.sidebar};
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
            for(const [index, category] of Object.entries(categories)) {
                if(!current.links[category]){
                    current.links[category] = {
                        title: category,
                        links: {}
                    };
                }
                current = current.links[category];
                if(index == categories.length - 1){
                    current.path = view.path;
                }
            }
        }

        function flatten(links){
            const out = [];
            for(const [name, item] of Object.entries(links || {})){
                out.push({
                    name,
                    path: item.path,
                    links: flatten(item.links)
                });
            }
            return out;
        }
        return flatten(out.links);
    }
};