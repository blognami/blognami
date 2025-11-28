---
menus:
    sidebar: ["Services", "renderTable"]
---
# renderTable

Render data tables with search and pagination.

## Interface

```javascript
this.renderTable(tableAdaptable, options)
```

### Parameters

- **tableAdaptable** - A database query or object with `toTableAdapter()` method
- **options** - Table configuration (title, search, columns)

### Returns

- Rendered table HTML

## Description

The `renderTable` service creates interactive data tables with built-in search functionality, pagination, and custom column rendering. It works with database queries and any object implementing the table adapter interface.

## Options

| Option | Description |
|--------|-------------|
| `title` | Table title |
| `search` | Array of column names to search |
| `columns` | Array of column definitions |

## Column Configuration

Columns can be strings (column name only) or objects:

```javascript
{
    name: 'columnName',
    title: 'Display Title',
    cell: (row) => customRenderer(row)
}
```

## Examples

### Basic Table with Search

```javascript
this.renderTable(
    this.database.users.orderBy('name').paginate(this.params.page),
    {
        search: ['name', 'email'],
        columns: ['name', 'email', 'createdAt']
    }
)
```

### Table with Custom Cell Renderers

```javascript
this.renderTable(
    this.database.posts.orderBy('createdAt', 'desc').paginate(this.params.page),
    {
        search: ['title'],
        columns: [
            {
                name: 'title',
                cell: ({ slug, title }) => this.renderHtml`
                    <a href="/${slug}">${title}</a>
                `
            },
            {
                name: 'createdAt',
                title: 'Date',
                cell: ({ createdAt }) => this.formatDate(createdAt, 'MMM dd, yyyy')
            },
            {
                name: 'actions',
                title: '',
                cell: (row) => this.renderView('_button', {
                    tagName: 'a',
                    body: 'Edit',
                    href: `/posts/${row.id}/edit`,
                    target: '_overlay'
                })
            }
        ]
    }
)
```

### Table with Async Cell Content

```javascript
this.renderTable(
    this.database.comments.orderBy('createdAt', 'desc').paginate(this.params.page),
    {
        columns: [
            {
                name: 'author',
                cell: ({ userId }) => async () => {
                    const user = await this.database.users.where({ id: userId }).first();
                    return user?.name || 'Unknown';
                }
            },
            { name: 'body' }
        ]
    }
)
```

## Notes

- Tables render in modal dialogs
- Search uses SQL LIKE queries on specified columns
- Pagination is handled automatically via `paginate()` on the query
- Cell functions receive the full row object
