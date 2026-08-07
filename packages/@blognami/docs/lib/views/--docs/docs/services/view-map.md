---
menu:
    path: ["Services", "viewMap"]
---
# viewMap

Map of available views filtered by feature flags.

## Interface

```javascript
const viewMap = await this.viewMap;
// { "admin/dashboard": "admin/dashboard", "admin": "admin/index", ... }
```

### Returns

- Object mapping view paths to resolved view names

## Description

The `viewMap` service provides a filtered list of all available views based on current feature flags. Views declaring `featureFor()` requirements are excluded when those flags are disabled. Index views are automatically mapped to parent paths.

## Index Route Mapping

```javascript
// View at 'admin/dashboard/index' is accessible via:
viewMap['admin/dashboard/index']  // → 'admin/dashboard/index'
viewMap['admin/dashboard']        // → 'admin/dashboard/index'
```

## Examples

### Check View Existence

```javascript
export default {
    async render() {
        const viewMap = await this.viewMap;

        if (!viewMap[this.params.page]) {
            return this.renderView('404');
        }

        return this.renderView(viewMap[this.params.page]);
    }
}
```

### Build Navigation

```javascript
export default {
    async render() {
        const viewMap = await this.viewMap;
        const adminViews = Object.keys(viewMap)
            .filter(name => name.startsWith('admin/'))
            .sort();

        return this.renderHtml`
            <nav>
                ${adminViews.map(view =>
                    this.renderHtml`<a href="/${view}">${view}</a>`
                )}
            </nav>
        `;
    }
}
```

### Feature-Aware Menu

```javascript
export default {
    async render() {
        const viewMap = await this.viewMap;

        // Views already filtered by feature flags
        const hasAdvanced = Object.keys(viewMap).some(
            name => name.includes('advanced')
        );

        return this.renderHtml`
            <menu>
                <a href="/">Home</a>
                ${hasAdvanced && this.renderHtml`
                    <a href="/advanced">Advanced</a>
                `}
            </menu>
        `;
    }
}
```

## Feature Flag Integration

Views can declare required features:

```javascript
export default {
    meta() {
        this.featureFor('adminPanel');
    },

    render() {
        // Only in viewMap when adminPanel flag enabled
        return this.renderHtml`<div>Admin Panel</div>`;
    }
}
```

## Notes

- Cached per unique feature flag combination
- Available on both server and client
- Used internally by `renderView` for resolution
- Views starting with `_` are excluded (partials)
