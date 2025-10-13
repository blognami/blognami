

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

    addMenuItem(menuName, item) {
        if (!this.menus[menuName]) {
            this.menus[menuName] = [];
        }
        this.menus[menuName].push(item);
    },

    normalizeAllMenus() {
        Object.keys(this.menus).forEach(menuName => {
            this.normalizeItems(this.menus[menuName]);
        });
    },

    normalizeItems(items, path = []) {
        if (!items || !Array.isArray(items)) {
            return;
        }
        
        items.forEach(item => {
            if (item.displayOrder === undefined) {
                item.displayOrder = 100;
            }
            
            if (item.target === undefined) {
                item.target = '_top';
            }
            
            // Recursively normalize nested items
            if (item.items) {
                this.normalizeItems(item.items, [...path, item.title]);
            }
        });
    },

    sortAllMenus() {
        Object.keys(this.menus).forEach(menuName => {
            this.sortItems(this.menus[menuName]);
        });
    },

    sortItems(items) {
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
}
