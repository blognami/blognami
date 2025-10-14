

export default {
    meta(){
        this.on('initializeMenus', function(){
            this.addMenuItem('navbar', { label: 'Docs', url: '/', displayOrder: 1 });
            this.addMenuItem('navbar', { label: 'Blog', url: 'https://blognami.com/pinstripe' });
            this.addMenuItem('navbar', { label: 'GitHub', url: 'https://github.com/blognami/blognami' });
            this.addMenuItem('navbar', 'Your Account', { label: 'Profile', url: '/profile' });
            this.addMenuItem('navbar', 'Your Account', { label: 'Settings', url: '/settings' });
            this.addMenuItem('navbar', 'Your Account', { label: 'Logout', url: '/logout', displayOrder: 200 });

            this.addMenuItem('sidebar', { label: 'About', partial: '_sidebar/_about', displayOrder: 1 });
            this.addMenuItem('sidebar', { label: 'Posts', children: [
                { label: 'All Posts', url: '/posts' },
                { label: 'Create Post', url: '/posts/create' }
            ]});

        });
    },

    create(){
        if(!this.context.root.menus){
            this.menus = {};

            // Allow other modules to add menu items
            this.trigger('initializeMenus');

            this.normalizeAllMenus();
            this.trigger('normalizeMenus');

            this.sortAllMenus();
            this.trigger('sortMenus');

            this.context.root.menus = this.menus;
        }

        return this.context.root.menus;
    },

    addMenuItem(...args) {
        const menuName = args.shift();
        const menuItem = args.pop();
        const path = args;
        
        // Initialize the menu if it doesn't exist
        if (!this.menus[menuName]) {
            this.menus[menuName] = [];
        }
        
        // If no path is provided, add directly to the menu
        if (path.length === 0) {
            this.menus[menuName].push(menuItem);
            return;
        }
        
        // Navigate to the nested location using the path
        let currentLevel = this.menus[menuName];
        
        for (let i = 0; i < path.length; i++) {
            const pathSegment = path[i];
            
            // Find existing menu item at this level
            let existingItem = currentLevel.find(item => item.label === pathSegment);
            
            // If it doesn't exist, create it
            if (!existingItem) {
                existingItem = {
                    label: pathSegment,
                    children: []
                };
                currentLevel.push(existingItem);
            }
            
            // Ensure children array exists
            if (!existingItem.children) {
                existingItem.children = [];
            }
            
            // Move to the next level
            currentLevel = existingItem.children;
        }
        
        // Add the menu item to the final nested location
        currentLevel.push(menuItem);
    },

    traverseMenuItems(menuName, fn){
        if(!this.menus[menuName]) return;
        traverseMenuItems.call(this, this.menus[menuName], [], fn);
    },

    normalizeAllMenus() {
        Object.keys(this.menus).forEach(menuName => {
            this.normalizeMenuItems(this.menus[menuName]);
        });
    },

    normalizeMenuItems(navigationItems, path = []) {
        if (!navigationItems || !Array.isArray(navigationItems)) {
            return;
        }
        
        navigationItems.forEach(menuItem => {
            if (menuItem.displayOrder === undefined) {
                menuItem.displayOrder = 100;
            }
            
            // Recursively normalize nested items
            if (menuItem.children) {
                this.normalizeMenuItems(menuItem.children, [...path, menuItem.label]);
            }
        });
    },

    sortAllMenus() {
        Object.keys(this.menus).forEach(menuName => {
            this.sortMenuItems(this.menus[menuName]);
        });
    },

    sortMenuItems(navigationItems) {
        if (!navigationItems || !Array.isArray(navigationItems)) {
            return;
        }
        
        // Sort current level by displayOrder, then by label
        navigationItems.sort((a, b) => {
            const orderA = a.displayOrder || 100;
            const orderB = b.displayOrder || 100;
            
            // First, sort by displayOrder
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            
            // If displayOrder is the same, sort by label
            const labelA = (a.label || '').toLowerCase();
            const labelB = (b.label || '').toLowerCase();
            return labelA.localeCompare(labelB);
        });
        
        // Recursively sort nested items
        navigationItems.forEach(menuItem => {
            if (menuItem.children) {
                this.sortMenuItems(menuItem.children);
            }
        });
    }
}


function traverseMenuItems(items, path, fn){
    items.forEach(item => {
        const currentPath = [...path, item];
        fn.call(this, item, currentPath);

        if (item.children) {
            traverseMenuItems.call(this, item.children, currentPath, fn);
        }
    });
}