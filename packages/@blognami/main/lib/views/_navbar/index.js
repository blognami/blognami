export const styles = `
    .root {
        display: flex;
        align-items: center;
        gap: 3.2rem;
    }

    .items {
        display: flex;
        align-items: center;
        gap: 2.4rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        transition: color 0.2s ease;
        padding: 0.8rem 0;
    }

    .link:hover {
        color: #111827;
    }

    .link-active {
        color: #35D0AC;
    }

    @media (max-width: 768px) {
        .items {
            display: none;
        }
    }
`;

export default {
    meta(){
        this.expose();
    },

    render(){
        const path = JSON.parse(this.params.path || '[]');

        const items = this.menus.navbar;
        
        this.normalizeItems(items);

        let currentItems = items;
        for(const label of path){
            currentItems = currentItems.find(item => item.label === label)?.children;
            if(!currentItems){
                return;
            }
        }

        if(path.length > 0){
            return this.renderHtml`
                <pinstripe-popover>
                    <pinstripe-menu>
                        ${currentItems.map(item => this.renderHtml`
                            <a href="${item.url}" target="${item.target}">${item.label}</a>
                        `)}
                    </pinstripe-menu>
                </pinstripe-popover>
            `;
        }

        return this.renderHtml`
            <nav class="${this.cssClasses.root}">
                <ul class="${this.cssClasses.items}">
                    ${currentItems.map(item => {
                        const isActive = this.initialParams._url.pathname === item.url;
                        const activeClass = isActive ? ` ${this.cssClasses.linkActive}` : '';
                        
                        return this.renderHtml`
                            <li><a href="${item.url}" class="${this.cssClasses.link}${activeClass}" target="${item.target}">${item.label}</a></li>
                        `;
                    })}
                </ul>
            </nav>
        `;
    },

    normalizeItems(items, path = []) {
        items.forEach(item => {
            if (item.partial === undefined) {
                item.partial = '_navbar/_link';
            }

            // If no url is provided, create a popover link for nested items
            if(item.url === undefined && item.children) {
                const url = new URL('/_navbar', 'http://localhost');
                url.searchParams.append('path', JSON.stringify([...path, item.label]));
                item.url = url.pathname + url.search;
                item.target = '_overlay';
            }

            if(item.target === undefined) {
                item.target = '_top';
            }
            
            // Recursively normalize nested items
            if (item.children) {
                this.normalizeItems(item.children, [...path, item.label]);
            }
        });
    }
    
};