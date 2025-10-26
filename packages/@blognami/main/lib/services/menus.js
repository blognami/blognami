

export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            // Admin-only Settings (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Edit Settings link
                this.addMenuItem('navbar', { 
                    label: 'Settings', 
                    testId: 'edit-settings',
                    children: []
                });

                // Edit Settings link for burger menu
                this.addMenuItem('burgerMenu', 'Account', { 
                    label: 'Settings', 
                    testId: 'edit-settings',
                    children: []
                });
            }

            this.addMenuItem('sidebar', { label: 'About', partial: '_sidebar/_about_section', displayOrder: 1 });

            // Add sidebar content to burger menu
            this.addMenuItem('burgerMenu', { label: 'About', partial: '_navbar/burger_menu/_about_section', displayOrder: 1 });

        });

        this.addHook('normalizeMenus', function(){
            this.traverseMenuItems('navbar', (item, path) => {
                if (item.partial === undefined) {
                    if(path.length === 1) {
                        item.partial = '_navbar/_link';
                    } else {
                        item.partial = '_navbar/menu/_link';
                    }
                }

                // If no url is provided, create a popover link for nested items
                if(item.url === undefined && item.children) {
                    const url = new URL('/_navbar/menu', 'http://localhost');
                    url.searchParams.append('path', JSON.stringify(path.map(item => item.label)));
                    item.url = url.pathname + url.search;
                    item.target = '_overlay';
                    
                    // Add data attributes for specific parent menu items
                    if (!item.preload) {
                        item.preload = true;
                    }
                }

                if(item.target === undefined) {
                    item.target = '_top';
                }

                // Handle data-confirm attribute
                if (item.dataConfirm !== undefined) {
                    if (!item.dataAttributes) {
                        item.dataAttributes = {};
                    }
                    item.dataAttributes.confirm = item.dataConfirm;
                }
            });

            this.traverseMenuItems('sidebar', (item, path) => {
                if (item.partial === undefined && path.length === 1) {
                    item.partial = '_sidebar/_link_group_section';
                }
            });

            this.traverseMenuItems('burgerMenu', (item, path) => {
                if (item.partial === undefined && path.length === 1) {
                    item.partial = '_navbar/burger_menu/_link_group_section';
                }

                if(item.target === undefined) {
                    item.target = '_top';
                }
            });
        });
    },

    create(){
        return this.defer(async () => {
            if(!this.context.root.menus){
                this.menus = {};

                // Allow other modules to add menu items
                await this.runHook('initializeMenus');

                this.normalizeAllMenus();
                await this.runHook('normalizeMenus');

                this.sortAllMenus();
                await this.runHook('sortMenus');

                this.context.root.menus = this.menus;
            }

            return this.context.root.menus;
        });
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

            if(menuItem.testId === undefined) {
                menuItem.testId = this.inflector.dasherize(menuItem.label);
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