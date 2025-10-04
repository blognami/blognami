````markdown
---
sidebar:
    category: ["Services", "renderTable"]
---
# renderTable Service

The `renderTable` service provides a powerful way to render data tables with built-in search, pagination, and flexible column configuration. It creates interactive, modal-based tables that integrate seamlessly with the Pinstripe framework.

## Interface

```javascript
this.renderTable(tableAdaptable, options = {})
```

### Parameters

- **`tableAdaptable`** (Required): A database table query or any object that implements `toTableAdapter()` method. Typically a Pinstripe database table with query chains like `.orderBy()`, `.where()`, `.paginate()`.

- **`options`** (Object): Configuration options for the table
  - **`title`** (String): Optional title for the table. If not provided, uses the table adapter's default title
  - **`search`** (Array): Array of column names to enable search functionality on
  - **`columns`** (Array): Array of column definitions. If not provided, uses all columns from the table adapter

### Column Configuration

Each column can be defined as:
- **String**: Simple column name (e.g., `'name'`)
- **Object**: Advanced column configuration:
  - `name` (String): Column identifier/field name
  - `title` (String): Display title (defaults to titleized name)
  - `cell` (Function): Custom renderer function that receives the row data

## Description

The `renderTable` service creates feature-rich data tables that:

1. **Displays data in a modal interface** with proper styling and layout
2. **Provides search functionality** when `search` option is configured
3. **Handles pagination automatically** for large datasets using the table adapter's pagination info
4. **Supports custom column rendering** through cell functions
5. **Integrates with the database layer** using the `toTableAdapter()` method
6. **Handles empty states gracefully** with "No data found" messaging
7. **Provides responsive design** with CSS classes and proper modal structure

The service is available on all views via `this.renderTable` and works with Pinstripe's database tables and any object implementing the table adapter interface.

## Key Features

- **Modal-based Display**: Tables are rendered in responsive modal windows
- **Search Integration**: Real-time search with URL state management
- **Pagination Support**: Automatic pagination with navigation controls
- **Custom Cell Renderers**: Full control over cell content and formatting
- **Responsive Design**: Mobile-friendly layout with proper CSS classes
- **Database Integration**: Seamless integration with Pinstripe database queries
- **Empty State Handling**: Graceful display when no data is available

## Examples

### Basic Table with Search
```javascript
// Simple table with search on title
export default {
    async render(){
        return this.renderTable(
            this.database.pages.orderBy('title').paginate(this.params.page),
            {
                search: ['title'],
                columns: [
                    {
                        name: 'title',
                        cell: ({ slug, title}) => this.renderHtml`
                            <a href="/${slug}" data-target="_top">${title}</a>
                        `
                    }
                ]
            }
        );
    }
};
```

### Multi-Column Table with Links
```javascript
// User table with multiple searchable columns
return this.renderTable(
    this.database.users.orderBy('name').paginate(this.params.page),
    {
        search: ['name', 'email'],
        columns: [
            {
                name: 'name',
                cell: ({ slug, name}) => this.renderHtml`
                    <a href="/${slug}" data-target="_top">${name}</a>
                `
            },
            {
                name: 'email',
                cell: ({ slug, email}) => this.renderHtml`
                    <a href="/${slug}" data-target="_top">${email}</a>
                `
            }
        ]
    }
);
```

### Table with Custom Formatting and Actions
```javascript
// Revisions table with date formatting and action buttons
return this.renderTable(
    this.database.revisions
        .where({ revisableId: this.params.revisableId, name: this.params.name })
        .orderBy('createdAt', 'desc')
        .paginate(this.params.page),
    {
        columns: [
            {
                name: 'createdAt',
                cell: row => this.renderHtml`
                    ${this.formatDate(row.createdAt, 'LLL dd, yyyy TT')}
                `
            },
            {
                name: 'by',
                cell: row => this.renderHtml`
                    ${async () => {
                        const user = await this.database.users.where({ id: row.userId }).first();
                        if(!user) return 'Unknown';
                        return user.name;
                    }}
                `
            },
            { 
                name: 'actions',
                title: '',
                cell: row => this.renderView('_button', {
                    tagName: 'a',
                    body: 'Restore',
                    isPrimary: true,
                    size: 'small',
                    href: `/_actions/admin/restore_revisable_field?id=${row.id}`,
                    target: '_overlay',
                    'data-test-id': 'restore'
                })
            }
        ]
    }
);
```

### Table with Interactive Elements
```javascript
// Tags table with checkboxes for selection
return this.renderTable(
    this.database.tags.orderBy('name').paginate(this.params.page),
    {
        search: ['name'],
        columns: [
            {
                name: 'name',
                title: 'Name',
                cell: ({ name, id: tagId }) => this.renderHtml`
                    <a
                        target="_overlay"
                        data-method="post"
                        href="/_actions/admin/toggle_tagable_tag?id=${id}&tagId=${tagId}"
                    >${name}</a>
                `
            },
            {
                name: 'tagged',
                title: 'Tagged?',
                cell: ({ id: tagId }) => async () => {
                    const tag = await this.database.tagableTags
                        .where({ tagId, tagableId: id })
                        .first();
                    return this.renderHtml`
                        <input
                            type="checkbox" 
                            ${tag ? 'checked' : ''}
                            data-component="pinstripe-anchor"
                            data-target="_overlay"
                            data-method="post"
                            data-href="/_actions/admin/toggle_tagable_tag?id=${id}&tagId=${tagId}"
                        >
                    `;
                }
            }
        ]
    }
);
```

### Embedded Table in Layout
```javascript
// Table embedded within other content
return this.renderHtml`
    <div class="${this.cssClasses.wrapper}">
        <h2>Available Tags</h2>
        ${this.renderTable(
            this.database.tags.orderBy('name').paginate(this.params.page),
            {
                search: ['name'],
                columns: [
                    {
                        name: 'name',
                        cell: ({ slug, name}) => this.renderHtml`
                            <a href="/${slug}" data-target="_top">${name}</a>
                        `
                    }
                ]
            }
        )}
    </div>
`;
```

### Simple Column Configuration
```javascript
// Using string-based column definitions
return this.renderTable(
    this.database.posts.orderBy('createdAt', 'desc').paginate(this.params.page),
    {
        search: ['title', 'content'],
        columns: ['title', 'createdAt', 'status']  // Simple string columns
    }
);
```

### Complex Query with Filters
```javascript
// Table with complex database query
const filteredPosts = this.database.posts
    .where({ status: 'published' })
    .where(query => query.where('title', 'like', `%${searchTerm}%`))
    .orderBy('publishedAt', 'desc')
    .paginate(this.params.page);

return this.renderTable(filteredPosts, {
    title: 'Published Posts',
    search: ['title', 'excerpt'],
    columns: [
        {
            name: 'title',
            cell: ({ slug, title }) => this.renderHtml`
                <a href="/posts/${slug}">${title}</a>
            `
        },
        {
            name: 'publishedAt',
            title: 'Published',
            cell: ({ publishedAt }) => this.formatDate(publishedAt, 'MMM dd, yyyy')
        },
        {
            name: 'author',
            cell: async ({ authorId }) => {
                const author = await this.database.users.find(authorId);
                return author?.name || 'Unknown';
            }
        }
    ]
});
```

### Custom Title and No Search
```javascript
// Table with custom title and no search functionality
return this.renderTable(
    this.database.logs.orderBy('createdAt', 'desc').limit(50),
    {
        title: 'Recent Activity Log',
        columns: [
            {
                name: 'timestamp',
                title: 'Time',
                cell: ({ createdAt }) => this.formatDate(createdAt, 'MMM dd HH:mm')
            },
            { name: 'action' },
            { name: 'details' }
        ]
    }
);
```

## Database Integration

The `renderTable` service works with Pinstripe's database tables through the `toTableAdapter()` method:

```javascript
// The table adapter provides:
const tableAdapter = await tableAdaptable.toTableAdapter({
    q: this.params.q,      // Search query from URL
    search: searchColumns   // Columns to search in
});

// Returns:
{
    title: 'Table Title',
    columns: [{ name: 'columnName' }],
    rows: [/* row data */],
    page: 1,
    pageCount: 5
}
```

## Search Functionality

When search is enabled:
- A search input appears at the top of the table
- Search queries are stored in URL parameters (`?q=searchterm`)
- Searches are performed on the specified columns using SQL LIKE queries
- Search clears pagination (resets to page 1)
- Search state persists across page refreshes

## Pagination

Pagination is handled automatically:
- Uses the `paginate()` method on database queries
- Displays pagination controls when `pageCount > 1`
- Page state is maintained in URL parameters
- Integrates with search functionality

## Styling and CSS Classes

The rendered table includes CSS classes for styling:
- `.root`: Main table element
- `.search`: Search input container
- `.heading-cell`: Table header cells
- `.data-cell`: Table data cells
- `.pagination`: Pagination container

## Return Value

Returns an `Html` instance representing a complete modal interface with:
- Responsive table layout
- Search functionality (if enabled)
- Pagination controls (if needed)
- Close button and modal wrapper
- Proper accessibility attributes

## Performance Considerations

- Database queries should include proper indexing for search columns
- Use `.limit()` for large datasets to prevent performance issues
- Async cell renderers are supported but should be used judiciously
- Search operations use SQL LIKE queries which may need optimization for large tables

## Integration with Forms and Actions

Tables integrate well with Pinstripe's action system:
- Use `target="_overlay"` for modal actions
- Include `data-test-id` attributes for testing
- Support for POST actions through `data-method="post"`
- Integration with form submissions and redirects
````