---
menus:
    sidebar: ["Services", "formatDate"]
---
# formatDate

Format dates using Luxon patterns.

## Interface

```javascript
this.formatDate(date, format)
```

### Parameters

- **date** - JavaScript Date object
- **format** - Luxon format pattern (default: `'LLL dd, yyyy'`)

### Returns

- Formatted date string

## Description

The `formatDate` service wraps Luxon's DateTime for consistent date formatting. Use it for publication dates, timestamps, and other date displays.

## Examples

### Basic Usage

```javascript
export default {
    async render() {
        const post = await this.database.posts.first();

        return this.renderHtml`
            <p>Published: ${this.formatDate(post.publishedAt)}</p>
        `;
        // "Published: Jul 01, 2023"
    }
}
```

### HTML Time Element

```javascript
return this.renderHtml`
    <time datetime="${this.formatDate(date, 'yyyy-MM-dd')}">
        ${this.formatDate(date)}
    </time>
`;
// <time datetime="2023-07-01">Jul 01, 2023</time>
```

### Table Column Formatting

```javascript
this.renderTable(this.database.posts, {
    columns: [
        { name: 'title' },
        {
            name: 'publishedAt',
            cell: ({ publishedAt }) => this.formatDate(publishedAt, 'MMM dd, yyyy')
        }
    ]
})
```

## Common Format Patterns

| Pattern | Output |
|---------|--------|
| `'LLL dd, yyyy'` | Jul 01, 2023 (default) |
| `'yyyy-MM-dd'` | 2023-07-01 |
| `'MMM dd, yyyy'` | Jul 01, 2023 |
| `'LLL dd, yyyy TT'` | Jul 01, 2023 2:30 PM |
| `"LLL dd 'at' hh:mm a"` | Jul 01 at 02:30 PM |
| `'MMM dd HH:mm'` | Jul 01 14:30 |

## Pattern Components

- `yyyy` - Year (2023)
- `MM` - Month number (07)
- `MMM` / `LLL` - Month name (Jul / July)
- `dd` - Day (01)
- `HH` / `hh` - Hour 24h/12h
- `mm` - Minutes
- `a` - AM/PM
- `TT` - Short time (2:30 PM)

## Notes

- Uses Luxon DateTime internally
- Returns empty string for null/undefined dates
- Patterns follow Luxon format specification
