import { View } from 'pinstripe';

export default {
    meta(){
        this.addHook('initializeMenus', 'initializeMenus');
        this.addHook('initializeMenus', 'loadMenuItemsFromAnnotations');
        this.addHook('normalizeMenus', 'normalizeNavbarMenu');
        this.addHook('normalizeMenus', 'normalizeSidebarMenu');
        this.addHook('normalizeMenus', 'normalizeBurgerMenu');
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

    async initializeMenus(){
        // Sign In link (shows when signed out)
        if (await this.isSignedOut) {
            this.addMenuItem('navbar', { 
                label: 'Sign in', 
                url: '/_actions/guest/sign_in', 
                target: '_overlay',
                displayOrder: 1000,
                preload: true,
                testId: 'sign-in'
            });
        }

        // Admin-only user links (shows for admin users when signed in)
        if (await this.isSignedIn && await this.user.role === 'admin') {
            // Add User to the Add Content menu
            this.addMenuItem('navbar', 'Add', { 
                label: 'User', 
                url: '/_actions/admin/add_user', 
                target: '_overlay', 
                testId: 'add-user' 
            });

            // Add User to the Find Content menu
            this.addMenuItem('navbar', 'Find', { 
                label: 'User', 
                url: '/_actions/admin/find_user', 
                target: '_overlay', 
                testId: 'find-user' 
            });

            // Add corresponding burger menu items under Account section
            this.addMenuItem('burgerMenu', 'Account', 'Add', { 
                label: 'User', 
                url: '/_actions/admin/add_user', 
                target: '_overlay', 
                testId: 'add-user' 
            });

            this.addMenuItem('burgerMenu', 'Account', 'Find', { 
                label: 'User', 
                url: '/_actions/admin/find_user', 
                target: '_overlay', 
                testId: 'find-user' 
            });
        }

        // Your Account menu (shows for any signed in user)
        if (await this.isSignedIn) {
            const user = await this.user;

            this.addMenuItem('navbar', {
                label: user.name,
                testId: 'your-account',
                displayOrder: 300
            });
            
            this.addMenuItem('navbar', user.name, { 
                label: 'Profile', 
                url: `/${await this.user.slug}`, 
                target: '_top',
                testId: 'profile'
            });

            // Notification preferences
            this.addMenuItem('navbar', user.name, { 
                label: 'Notification preferences', 
                url: '/_actions/user/edit_user_notification_preferences', 
                target: '_overlay',
                testId: 'edit-user-notification-preferences'
            });

            this.addMenuItem('navbar', user.name, { 
                label: 'Sign out', 
                url: '/_actions/guest/sign_out', 
                target: '_overlay',
                displayOrder: 200,
                testId: 'sign-out'
            });

            // Burger menu equivalents
            this.addMenuItem('burgerMenu', 'Account', {
                label: user.name,
                testId: 'your-account',
                displayOrder: 300
            });
            
            this.addMenuItem('burgerMenu', 'Account', user.name, { 
                label: 'Profile', 
                url: `/${await this.user.slug}`, 
                target: '_top',
                testId: 'profile'
            });

            // Notification preferences
            this.addMenuItem('burgerMenu', 'Account', user.name, { 
                label: 'Notification preferences', 
                url: '/_actions/user/edit_user_notification_preferences', 
                target: '_overlay',
                testId: 'edit-user-notification-preferences'
            });

            this.addMenuItem('burgerMenu', 'Account', user.name, { 
                label: 'Sign out', 
                url: '/_actions/guest/sign_out', 
                target: '_overlay',
                displayOrder: 200,
                testId: 'sign-out'
            });
        }

        // Sign In link for burger menu (shows when signed out)
        if (await this.isSignedOut) {
            this.addMenuItem('burgerMenu', 'Account', { 
                label: 'Sign in', 
                url: '/_actions/guest/sign_in', 
                target: '_overlay',
                displayOrder: 1000,
                preload: true,
                testId: 'sign-in'
            });
        }

        // Site-specific menu items (merged from @blognami/site)
        // Admin-only Site Settings (shows for admin users when signed in)
        if (await this.isSignedIn && await this.user.role === 'admin') {
            // Site settings in Settings menu
            this.addMenuItem('navbar', 'Settings', { 
                label: 'Site', 
                url: '/_actions/admin/edit_site_meta', 
                target: '_overlay', 
                testId: 'edit-site-meta' 
            });

            // Site settings in burger menu Settings
            this.addMenuItem('burgerMenu', 'Account', 'Settings', { 
                label: 'Site', 
                url: '/_actions/admin/edit_site_meta', 
                target: '_overlay', 
                testId: 'edit-site-meta' 
            });
        }

        // Top section menu items
        this.addMenuItem('sidebar', { label: 'Top', partial: '_sidebar/_top_section', displayOrder: 1 });

        // Add sidebar content to burger menu
        this.addMenuItem('burgerMenu', { label: 'Top', partial: '_navbar/burger_menu/_top_section', displayOrder: 1 });

        // Legal footer menu items
        this.addMenuItem('footer', 'Legal', { label: 'Terms of Service', url: '/legal/terms-of-service' });
        this.addMenuItem('footer', 'Legal', { label: 'Privacy Policy', url: '/legal/privacy-policy' });
        this.addMenuItem('footer', 'Legal', { label: 'Cookie Policy', url: '/legal/cookie-policy' });

        // Stripe subscription menu items (merged from @blognami/stripe)
        // Newsletter subscription menu (shows for any signed in user)
        if (await this.isSignedIn) {
            const user = await this.user;

            // Newsletter subscription (only show if user is subscribed)
            if (await this.database.newsletter.isSubscribed(user)) {
                const isPaid = await this.database.newsletter.isSubscribed(user, { tier: 'paid' });
                const confirmMessage = isPaid ? (
                    `Are you sure you want to unsubscribe? You will lose access to members only content, and any remaining subscription time will be lost.`
                ) : (
                    `Are you sure you want to unsubscribe? You will lose access to members only content.`
                );

                this.addMenuItem('navbar', user.name, { 
                    label: `Unsubscribe (from ${isPaid ? 'paid' : 'free'} membership)`, 
                    url: `/_actions/user/unsubscribe?subscribableId=${this.database.newsletter.id}`, 
                    target: '_overlay',
                    testId: 'unsubscribe',
                    dataConfirm: confirmMessage
                });

                // Newsletter subscription for burger menu
                this.addMenuItem('burgerMenu', 'Account', user.name, { 
                    label: `Unsubscribe (from ${isPaid ? 'paid' : 'free'} membership)`, 
                    url: `/_actions/user/unsubscribe?subscribableId=${this.database.newsletter.id}`, 
                    target: '_overlay',
                    testId: 'unsubscribe',
                    dataConfirm: confirmMessage
                });
            }
        }

        // Admin-only Stripe Settings (shows for admin users when signed in)
        if (await this.isSignedIn && await this.user.role === 'admin') {
            // Edit Stripe link for navbar
            this.addMenuItem('navbar', 'Settings', { 
                label: 'Stripe', 
                url: '/_actions/admin/edit_stripe', 
                target: '_overlay', 
                testId: 'edit-stripe' 
            });

            // Edit Stripe link for burger menu
            this.addMenuItem('burgerMenu', 'Account', 'Settings', { 
                label: 'Stripe', 
                url: '/_actions/admin/edit_stripe', 
                target: '_overlay', 
                testId: 'edit-stripe' 
            });

            // Newsletter settings (merged from @blognami/newsletter)
            // Add Newsletter settings to navbar Settings menu
            this.addMenuItem('navbar', 'Settings', { 
                label: 'Newsletter', 
                url: '/_actions/admin/edit_newsletter', 
                target: '_overlay', 
                testId: 'edit-site-membership' 
            });

            // Add Newsletter settings to burger menu Settings
            this.addMenuItem('burgerMenu', 'Account', 'Settings', { 
                label: 'Newsletter', 
                url: '/_actions/admin/edit_newsletter', 
                target: '_overlay', 
                testId: 'edit-site-membership' 
            });
        }
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
                    testId: this.inflector.dasherize(pathSegment),
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
    },

    async loadMenuItemsFromAnnotations(){
        const cacheKey = `menuItemsFromAnnotations:${JSON.stringify(await this.featureFlags)}`;

        if(!View.cache[cacheKey]){
            const out = [];
            const viewMap = await this.viewMap;
            const reversedViewMap = {};
            for(const [path, viewName] of Object.entries(viewMap)) {
                reversedViewMap[viewName] ??= [];
                reversedViewMap[viewName].push(path);
            }
            const normalizedViewMap = {};
            for(const [viewName, paths] of Object.entries(reversedViewMap)) {
                // Choose the shortest path as the canonical one
                paths.sort((a, b) => a.length - b.length);
                normalizedViewMap[paths[0]] = viewName;
            }

            for(const [path, viewName] of Object.entries(normalizedViewMap)) {
                const annotations = View.for(viewName).annotations;
                if(annotations && annotations.menus) {
                    for(const [menuName, _menuPath] of Object.entries(annotations.menus)) {
                        const menuPath = [..._menuPath];
                        const label = menuPath.pop();
                        const menuItem = {
                            label,
                            url: `/${path}`.replace(/\/index$/, '') || '/'
                        };
                        out.push([menuName, ...menuPath, menuItem]);

                        // Also add sidebar items to burger menu for mobile navigation
                        if(menuName === 'sidebar') {
                            out.push(['burgerMenu', ...menuPath, { ...menuItem }]);
                        }
                    }
                }
            }
            View.cache[cacheKey] = out;
        }
        View.cache[cacheKey].forEach(args => this.addMenuItem(...args));
    },

    normalizeNavbarMenu(){
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
    },

    normalizeSidebarMenu(){
        this.traverseMenuItems('sidebar', (item, path) => {
            if (item.partial === undefined && path.length === 1) {
                item.partial = '_sidebar/_link_group_section';
            }
        });
    },

    normalizeBurgerMenu(){
        this.traverseMenuItems('burgerMenu', (item, path) => {
            if (item.partial === undefined && path.length === 1) {
                item.partial = '_navbar/burger_menu/_link_group_section';
            }

            if(item.target === undefined) {
                item.target = '_top';
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