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

        this.items = [
            { title: 'Docs', href: '/', displayOrder: 1 },
            { title: 'Blog', href: 'https://blognami.com/pinstripe' },
            { title: 'GitHub', href: 'https://github.com/blognami/blognami' },
            {
                title: 'Your Account',
                items: [
                    { title: 'Profile', href: '/profile', displayOrder: 2 },
                    { title: 'Settings', href: '/settings', displayOrder: 1 },
                    { title: 'Logout', href: '/logout', displayOrder: 3 }
                ]
            }
        ];

        this.trigger('initializeItems');
        
        this.normalizeItems();

        this.sortItems();

        let currentItems = this.items;
        for(const title of path){
            currentItems = currentItems.find(item => item.title === title)?.items;
            if(!currentItems){
                return;
            }
        }

        if(path.length > 0){
            return this.renderHtml`
                <pinstripe-popover>
                    <pinstripe-menu>
                        ${currentItems.map(item => this.renderHtml`
                            <a href="${item.href}" target="${item.target}">${item.title}</a>
                        `)}
                    </pinstripe-menu>
                </pinstripe-popover>
            `;
        }

        return this.renderHtml`
            <nav class="${this.cssClasses.root}">
                <ul class="${this.cssClasses.items}">
                    ${currentItems.map(item => {
                        const isActive = this.initialParams._url.pathname === item.href;
                        const activeClass = isActive ? ` ${this.cssClasses.linkActive}` : '';
                        
                        return this.renderHtml`
                            <li><a href="${item.href}" class="${this.cssClasses.link}${activeClass}" target="${item.target}">${item.title}</a></li>
                        `;
                    })}
                </ul>
            </nav>
        `;
    },

    normalizeItems(items = this.items, path = []) {
        if (!items || !Array.isArray(items)) {
            return;
        }
        
        items.forEach(item => {
            if (item.displayOrder === undefined) {
                item.displayOrder = 100;
            }
            
            if (item.partial === undefined) {
                item.partial = '_navbar/_link';
            }

            if(item.href === undefined){
                item.href = new URL('/_navbar', this.initialParams._url);
                item.href.searchParams.append('path', JSON.stringify([...path, item.title]));
                item.target = '_overlay';
            }

            if(item.target === undefined){
                item.target = '_top';
            }
            
            // Recursively normalize nested items
            if (item.items) {
                this.normalizeItems(item.items, [...path, item.title]);
            }
        });
    },

    sortItems(items = this.items) {
        if (!items || !Array.isArray(items)) {
            return;
        }
        
        // Sort current level by displayOrder, then by title
        items.sort((a, b) => {
            const orderA = a.displayOrder || 100;
            const orderB = b.displayOrder || 100;
            
            // First, sort by displayOrder
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            
            // If displayOrder is the same, sort by title
            const titleA = (a.title || '').toLowerCase();
            const titleB = (b.title || '').toLowerCase();
            return titleA.localeCompare(titleB);
        });
        
        // Recursively sort nested items
        items.forEach(item => {
            if (item.items) {
                this.sortItems(item.items);
            }
        });
    }
    
};