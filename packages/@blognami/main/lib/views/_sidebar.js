
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
        this.items = [];

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                ${this.renderLinks(this.items)}
            </aside>
        `;
    },

    async renderLinks(links, level = 0){
        if (!links || links.length === 0) return;

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

    sortItems(items) {
        // assume all items have display order of 100 unless specified
        const defaultDisplayOrder = 100;
        return items.sort((a, b) => {
            const aDisplayOrder = a.displayOrder || defaultDisplayOrder;
            const bDisplayOrder = b.displayOrder || defaultDisplayOrder;
            return aDisplayOrder - bDisplayOrder;
        });   
    }
};