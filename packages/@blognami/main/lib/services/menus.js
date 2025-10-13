

export default {
    create(){
        this.menus = {};

        // Allow other modules to add menu items
        this.trigger('initializeMenus');

        // Normalize and sort all menus
        this.normalizeAllMenus();
        this.sortAllMenus();

        return this.menus;
    },

    addMenuItem(menuName, menuItem) {
        if (!this.menus[menuName]) {
            this.menus[menuName] = [];
        }
        this.menus[menuName].push(menuItem);
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
            
            if (menuItem.target === undefined) {
                menuItem.target = '_top';
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
