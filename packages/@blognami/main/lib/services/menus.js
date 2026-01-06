import { View } from 'pinstripe';

export default {
    meta(){
        this.addHook('initializeMenus', 'initializeMenus');
        this.addHook('initializeMenus', 'loadMenuItemsFromAnnotations');
    },

    create(){
        return this.defer(async () => {
            if(!this.context.root.menus){
                this.menus = {};

                // Allow other modules to add menu items
                await this.runHook('initializeMenus');

                this.normalizeMenus();

                await this.filterMenus();

                this.sortMenus();

                this.context.root.menus = this.menus;
            }

            return this.context.root.menus;
        });
    },

    async initializeMenus(){
        // Sign In link (shows when signed out)
        this.addMenuItem('user', {
            label: 'Sign in',
            url: '/_actions/guest/sign_in',
            target: '_overlay',
            displayOrder: 1000,
            preload: true,
            testId: 'sign-in',
            showIf: 'guest'
        });

        // Admin-only user links
        this.addMenuItem('user', 'Add', {
            label: 'User',
            url: '/_actions/admin/add_user',
            target: '_overlay',
            testId: 'add-user',
            showIf: 'admin'
        });

        this.addMenuItem('user', 'Find', {
            label: 'User',
            url: '/_actions/admin/find_user',
            target: '_overlay',
            testId: 'find-user',
            showIf: 'admin'
        });

        // Your Account menu (shows for any signed in user)
        if (await this.isSignedIn) {
            const user = await this.user;

            this.addMenuItem('user', {
                label: user.name,
                testId: 'your-account',
                displayOrder: 300,
                showIf: ['user', 'admin']
            });

            this.addMenuItem('user', user.name, {
                label: 'Profile',
                url: `/${user.slug}`,
                target: '_top',
                testId: 'profile',
                showIf: ['user', 'admin']
            });

            this.addMenuItem('user', user.name, {
                label: 'Notification preferences',
                url: '/_actions/user/edit_user_notification_preferences',
                target: '_overlay',
                testId: 'edit-user-notification-preferences',
                showIf: ['user', 'admin']
            });

            this.addMenuItem('user', user.name, {
                label: 'Sign out',
                url: '/_actions/guest/sign_out',
                target: '_overlay',
                displayOrder: 200,
                testId: 'sign-out',
                showIf: ['user', 'admin']
            });

            // Newsletter subscription (only show if user is subscribed)
            if (await this.database.newsletter.isSubscribed(user)) {
                const isPaid = await this.database.newsletter.isSubscribed(user, { tier: 'paid' });
                const confirmMessage = isPaid ? (
                    `Are you sure you want to cancel your subscription? You will lose access to members only content, and any remaining subscription time will be lost.`
                ) : (
                    `Are you sure you want to cancel your subscription? You will lose access to members only content.`
                );

                this.addMenuItem('user', user.name, {
                    label: `Cancel newsletter subscription (${isPaid ? 'paid' : 'free'})`,
                    url: `/_actions/user/unsubscribe?subscribableId=${await this.database.newsletter.id}`,
                    target: '_overlay',
                    testId: 'unsubscribe',
                    dataConfirm: confirmMessage,
                    showIf: ['user', 'admin']
                });
            }
        }

        // Admin-only Site Settings
        this.addMenuItem('user', 'Settings', {
            label: 'Site',
            url: '/_actions/admin/edit_site_meta',
            target: '_overlay',
            testId: 'edit-site-meta',
            showIf: 'admin'
        });

        this.addMenuItem('user', 'Settings', {
            label: 'Stripe',
            url: '/_actions/admin/edit_stripe',
            target: '_overlay',
            testId: 'edit-stripe',
            showIf: 'admin'
        });

        this.addMenuItem('user', 'Settings', {
            label: 'Newsletter',
            url: '/_actions/admin/edit_newsletter',
            target: '_overlay',
            testId: 'edit-site-membership',
            showIf: 'admin'
        });

        // SaaS Unsubscribe (only show for paid subscribers)
        const tenant = await this.database.tenant;
        if(tenant?.subscriptionTier === 'paid'){
            this.addMenuItem('user', 'Settings', {
                label: 'Cancel Blognami subscription',
                url: '/_actions/admin/saas_unsubscribe',
                target: '_overlay',
                testId: 'saas-unsubscribe',
                displayOrder: 200,
                dataConfirm: 'Are you sure you want to cancel your subscription? You will lose any remaining subscription time and your blog will revert to demo mode with 3 days until expiry.',
                showIf: 'admin'
            });
        }

        // Legal footer menu items
        this.addMenuItem('legal', { label: 'Terms of Service', url: '/legal/terms-of-service' });
        this.addMenuItem('legal', { label: 'Privacy Policy', url: '/legal/privacy-policy' });
        this.addMenuItem('legal', { label: 'Cookie Policy', url: '/legal/cookie-policy' });
    },

    addMenuItem(...args){
        const menuName = args.shift();
        const props = { ...args.pop() };
        const path = args;

        this.menus[menuName] ||= [];

        let items = this.menus[menuName];

        for(const pathSegment of path){
            const id = this.inflector.dasherize(pathSegment);
            let item = items.find(item => item.id === id);
            if(!item){
                item = { id };
                items.push(item);
            }
            item.label ??= pathSegment;
            item.testId ??= id;
            item.children ??= [];

            items = item.children;
        }

        props.id ??= this.inflector.dasherize(props.label);

        const item = items.find(item => item.id === props.id);

        if(item){
            Object.assign(item, props);
            return;
        }

        items.push(props);
    },

    normalizeMenus() {
        Object.keys(this.menus).forEach(menuName => {
            this.normalizeMenuItems(this.menus[menuName]);
        });
    },

    normalizeMenuItems(navigationItems) {
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
                this.normalizeMenuItems(menuItem.children);
            }
        });
    },

    sortMenus() {
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

    async filterMenus() {
        for (const menuName of Object.keys(this.menus)) {
            this.menus[menuName] = await this.filterMenuItems(this.menus[menuName]);
        }
    },

    async filterMenuItems(items) {
        if (!items || !Array.isArray(items)) return items;

        const filtered = [];
        for (const item of items) {
            if (await this.shouldShowItem(item)) {
                if (item.children) {
                    item.children = await this.filterMenuItems(item.children);
                }
                // Only include item if it has a url or has children with urls
                if (item.url || this.hasDescendantWithUrl(item)) {
                    filtered.push(item);
                }
            }
        }
        return filtered;
    },

    hasDescendantWithUrl(item) {
        if (!item.children || item.children.length === 0) return false;
        return item.children.some(child => child.url || this.hasDescendantWithUrl(child));
    },

    async shouldShowItem(item) {
        if (item.showIf === undefined) return true;

        const roles = Array.isArray(item.showIf) ? item.showIf : [item.showIf];

        for (const role of roles) {
            if (role === 'guest' && await this.isSignedOut) return true;
            if (role !== 'guest' && await this.isSignedIn) {
                const user = await this.user;
                if (user.role === role) return true;
            }
        }
        return false;
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
                paths.sort((a, b) => a.length - b.length);
                normalizedViewMap[paths[0]] = viewName;
            }

            for(const [path, viewName] of Object.entries(normalizedViewMap)) {
                const { menu } = View.for(viewName).annotations || {};
                if(menu) {
                    const menuPath = [...menu.path];
                    const label = menuPath.pop();
                    const menuItem = {
                        label,
                        url: `/${path}`.replace(/\/index$/, '') || '/'
                    };
                    if(menu.displayOrder !== undefined) {
                        menuItem.displayOrder = menu.displayOrder;
                    }
                    out.push(['content', ...menuPath, menuItem]);
                }
            }
            View.cache[cacheKey] = out;
        }
        View.cache[cacheKey].forEach(args => this.addMenuItem(...args));
    }
}
