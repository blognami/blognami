---
sidebar:
    category: ["Services", "viewMap"]
---
# viewMap Service

The `viewMap` service provides a dynamic mapping of all available views in a Pinstripe application, filtered by feature flags. It serves as the central registry for view resolution, enabling features like conditional view availability, view filtering, and dynamic route generation.

## Interface

```javascript
// Service interface
const viewMap = await this.viewMap;
// Returns: Object with view names as keys and resolved view names as values

// Example of returned values:
{
  "admin/dashboard": "admin/dashboard",
  "admin/users": "admin/users", 
  "public/home": "public/home",
  "public/about": "public/about",
  "admin": "admin/index",  // index views get mapped to parent paths
  "public": "public/index"
}
```

## Description

The `viewMap` service creates a comprehensive mapping of all registered views in the application, applying several important transformations:

- **Feature Flag Filtering**: Views are automatically excluded if their required feature flags are disabled
- **Index Path Mapping**: Views ending in `/index` are mapped to their parent path (e.g., `admin/index` → `admin`)
- **Dynamic Caching**: Results are cached based on the current feature flag configuration for optimal performance
- **Client-Side Availability**: The service is automatically available on both server and client sides

The service integrates deeply with Pinstripe's view system and feature flag infrastructure to provide a single source of truth for view availability.

## Key Features

- **Feature Flag Integration**: Automatically filters views based on their `featureFor()` declarations
- **Smart Caching**: Caches view maps per unique feature flag combination
- **Index Route Handling**: Provides convenient mapping for index views
- **Performance Optimized**: Uses deferred execution and intelligent caching
- **Universal Access**: Available in both server and client environments

## Examples

### Basic View Map Access

```javascript
// Get all available views
export default {
    async render(){
        const viewMap = await this.viewMap;
        const availableViews = Object.keys(viewMap);
        
        return this.renderHtml`
            <nav>
                ${availableViews.map(viewName => 
                    this.renderHtml`<a href="/${viewName}">${viewName}</a>`
                )}
            </nav>
        `;
    }
}
```

### View Resolution for Routing

```javascript
// Check if a view exists before rendering
export default {
    async render(){
        const { viewName } = this.params;
        const viewMap = await this.viewMap;
        
        if(!viewMap[viewName]) {
            return this.renderView('404');
        }
        
        return this.renderView(viewMap[viewName]);
    }
}
```

### Dynamic Navigation Generation

```javascript
// Build navigation from available views
export default {
    async render(){
        const viewMap = await this.viewMap;
        
        // Filter admin views if available
        const adminViews = Object.keys(viewMap)
            .filter(name => name.startsWith('admin/'))
            .sort();
            
        const publicViews = Object.keys(viewMap)
            .filter(name => name.startsWith('public/'))
            .sort();
        
        return this.renderHtml`
            <nav class="main-nav">
                <section class="public-nav">
                    <h3>Public</h3>
                    ${publicViews.map(view => 
                        this.renderHtml`<a href="/${view}">${view}</a>`
                    )}
                </section>
                
                ${adminViews.length > 0 ? this.renderHtml`
                    <section class="admin-nav">
                        <h3>Admin</h3>
                        ${adminViews.map(view => 
                            this.renderHtml`<a href="/${view}">${view}</a>`
                        )}
                    </section>
                ` : ''}
            </nav>
        `;
    }
}
```

### View Filtering and Matching

```javascript
// Filter views based on patterns
export default {
    async render(){
        const viewMap = await this.viewMap;
        const viewNames = Object.keys(viewMap);
        
        // Find all blog-related views
        const blogViews = viewNames.filter(name => 
            name.includes('blog') || name.includes('post')
        );
        
        // Find all dashboard views
        const dashboards = viewNames.filter(name => 
            name.endsWith('dashboard') || name.endsWith('/dashboard')
        );
        
        return this.renderHtml`
            <div class="view-categories">
                <div class="blog-section">
                    <h3>Blog Views (${blogViews.length})</h3>
                    ${blogViews.map(view => 
                        this.renderHtml`<div>${view}</div>`
                    )}
                </div>
                
                <div class="dashboard-section">
                    <h3>Dashboards (${dashboards.length})</h3>
                    ${dashboards.map(view => 
                        this.renderHtml`<div>${view}</div>`
                    )}
                </div>
            </div>
        `;
    }
}
```

### Feature-Aware View Selection

```javascript
// Use viewMap to build feature-aware interfaces
export default {
    async render(){
        const viewMap = await this.viewMap;
        const featureFlags = await this.featureFlags;
        
        // Views are already filtered by feature flags in viewMap
        const availableViews = Object.keys(viewMap);
        
        // Group views by feature availability
        const basicViews = availableViews.filter(name => 
            !name.includes('admin') && !name.includes('advanced')
        );
        
        const advancedViews = availableViews.filter(name => 
            name.includes('advanced') || name.includes('pro')
        );
        
        return this.renderHtml`
            <div class="feature-views">
                <section class="basic-features">
                    <h3>Available Features</h3>
                    ${basicViews.map(view => 
                        this.renderHtml`
                            <button data-view="${view}" class="feature-button">
                                ${this.humanize(view)}
                            </button>
                        `
                    )}
                </section>
                
                ${advancedViews.length > 0 ? this.renderHtml`
                    <section class="advanced-features">
                        <h3>Advanced Features</h3>
                        ${advancedViews.map(view => 
                            this.renderHtml`
                                <button data-view="${view}" class="feature-button advanced">
                                    ${this.humanize(view)}
                                </button>
                            `
                        )}
                    </section>
                ` : ''}
            </div>
        `;
    },
    
    humanize(viewName) {
        return viewName
            .split('/')
            .pop()
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
}
```

### Site Map Generation

```javascript
// Generate a complete site map from available views
export default {
    async render(){
        const viewMap = await this.viewMap;
        
        // Build hierarchical structure from flat view names
        const siteMap = this.buildHierarchy(Object.keys(viewMap));
        
        return this.renderHtml`
            <div class="site-map">
                <h1>Site Map</h1>
                ${this.renderSiteMapSection(siteMap)}
            </div>
        `;
    },
    
    buildHierarchy(viewNames) {
        const hierarchy = {};
        
        viewNames.forEach(viewName => {
            const parts = viewName.split('/');
            let current = hierarchy;
            
            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = index === parts.length - 1 ? viewName : {};
                }
                current = current[part];
            });
        });
        
        return hierarchy;
    },
    
    renderSiteMapSection(section, level = 0) {
        const indent = '  '.repeat(level);
        
        return Object.entries(section).map(([key, value]) => {
            if (typeof value === 'string') {
                // Leaf node - actual view
                return this.renderHtml`
                    <div style="margin-left: ${level * 20}px">
                        <a href="/${value}" class="site-map-link">
                            ${key}
                        </a>
                    </div>
                `;
            } else {
                // Branch node - section
                return this.renderHtml`
                    <div style="margin-left: ${level * 20}px" class="site-map-section">
                        <strong>${key}</strong>
                        ${this.renderSiteMapSection(value, level + 1)}
                    </div>
                `;
            }
        });
    }
}
```

### Development Tools Integration

```javascript
// Build development tools that show available views
export default {
    async render(){
        const viewMap = await this.viewMap;
        const featureFlags = await this.featureFlags;
        
        // Show debugging information about views
        const viewInfo = Object.entries(viewMap).map(([name, resolvedName]) => ({
            name,
            resolvedName,
            isIndexRoute: name !== resolvedName,
            category: name.split('/')[0] || 'root'
        }));
        
        const categories = [...new Set(viewInfo.map(v => v.category))].sort();
        
        return this.renderHtml`
            <div class="dev-tools">
                <h2>View Map Debug Info</h2>
                
                <details>
                    <summary>Feature Flags (${Object.keys(featureFlags).length})</summary>
                    <pre>${JSON.stringify(featureFlags, null, 2)}</pre>
                </details>
                
                <details>
                    <summary>View Categories (${categories.length})</summary>
                    ${categories.map(category => {
                        const categoryViews = viewInfo.filter(v => v.category === category);
                        return this.renderHtml`
                            <div class="category">
                                <h4>${category} (${categoryViews.length} views)</h4>
                                <ul>
                                    ${categoryViews.map(view => this.renderHtml`
                                        <li>
                                            <code>${view.name}</code>
                                            ${view.isIndexRoute ? 
                                                this.renderHtml` → <code>${view.resolvedName}</code>` : 
                                                ''
                                            }
                                        </li>
                                    `)}
                                </ul>
                            </div>
                        `;
                    })}
                </details>
                
                <details>
                    <summary>All Views (${viewInfo.length})</summary>
                    <table class="view-table">
                        <thead>
                            <tr>
                                <th>View Name</th>
                                <th>Resolved Name</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${viewInfo.map(view => this.renderHtml`
                                <tr>
                                    <td><code>${view.name}</code></td>
                                    <td><code>${view.resolvedName}</code></td>
                                    <td>${view.isIndexRoute ? 'Index Route' : 'Direct'}</td>
                                    <td>
                                        <a href="/${view.name}" target="_blank">View</a>
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </details>
            </div>
        `;
    }
}
```

## Index Route Mapping

The service automatically creates convenient mappings for index routes:

```javascript
// If you have a view at 'admin/dashboard/index'
const viewMap = await this.viewMap;

// Both of these will work:
viewMap['admin/dashboard/index']  // → 'admin/dashboard/index'
viewMap['admin/dashboard']        // → 'admin/dashboard/index'

// This allows flexible routing where '/admin/dashboard' renders 'admin/dashboard/index'
```

## Feature Flag Integration

Views can declare feature requirements in their `meta()` method:

```javascript
// In a view file
export default {
    meta(){
        this.featureFor('adminPanel');
        this.featureFor('advancedReporting'); 
    },
    
    async render(){
        // This view only appears in viewMap when BOTH
        // adminPanel AND advancedReporting flags are enabled
        return this.renderHtml`<div>Advanced Admin Panel</div>`;
    }
}
```

The `viewMap` service automatically excludes views whose feature requirements aren't met.

## Caching Strategy

The service implements intelligent caching:

- **Feature Flag Based**: Each unique combination of feature flags gets its own cached view map
- **Context Scoped**: Cache is scoped to the current request context
- **Deferred Execution**: View map is only computed when first accessed
- **Memory Efficient**: Cache keys are JSON serialized feature flag objects

## Performance Considerations

- View filtering happens at service creation time, not per access
- Feature flag normalization ensures consistent cache keys
- The service uses Pinstripe's `defer()` utility for lazy loading
- Client-side usage leverages the same caching as server-side

## Error Handling

The service provides graceful error handling:

- Missing views in the map return `undefined` when accessed
- Invalid feature flag configurations are handled gracefully
- The service falls back to empty maps when View.names is unavailable

## Related Services

- **`matchViews`**: Uses `viewMap` to filter and sort views by patterns
- **`renderView`**: Uses `viewMap` to resolve view names before rendering
- **`featureFlags`**: Provides the feature flag data used for view filtering
- **`View`**: The underlying view registry that provides the raw view data

## Use Cases

### Navigation Systems
Use `viewMap` to build dynamic navigation menus that automatically adapt to available features.

### Route Resolution
Implement flexible routing systems that can resolve both direct paths and index routes.

### Development Tools
Build debugging interfaces that show all available views and their feature requirements.

### Site Generation
Generate sitemaps, API documentation, or other meta-content based on available views.

### Feature Toggling
Create feature-aware user interfaces that only show options for enabled features.

### Access Control
Implement permission-based view filtering by integrating feature flags with user roles.

## Technical Notes

- The service is marked for client inclusion via `this.addToClient()` in its `meta()` method
- View filtering is based on logical OR of feature requirements (if a view requires multiple features, any one being enabled makes it available)
- Index route mapping happens after feature filtering to ensure consistency
- The service integrates with Pinstripe's `View.cache` system for optimal performance