---
menus:
    sidebar: ["Services", "formatDate"]
---
# formatDate Service

The `formatDate` service provides date formatting functionality using the Luxon DateTime library. It converts JavaScript Date objects into formatted strings using customizable format patterns, with support for internationalization and various display formats.

## Interface

```javascript
this.formatDate(date, format)
```

### Parameters

- **`date`** (Date) - A JavaScript Date object to be formatted
- **`format`** (string, optional) - A Luxon format pattern string. Defaults to `'LLL dd, yyyy'`

### Return Value

Returns a `string` containing the formatted date according to the specified format pattern.

## Description

The `formatDate` service is built on top of Luxon's DateTime class and provides a convenient way to format dates consistently across your application. It:

1. **Converts JavaScript Dates to Luxon DateTime** objects for enhanced formatting capabilities
2. **Supports flexible format patterns** using Luxon's comprehensive formatting system
3. **Provides sensible defaults** with a human-readable format (`'LLL dd, yyyy'`) when no format is specified
4. **Handles internationalization** through Luxon's built-in locale support
5. **Maintains consistency** across date displays throughout the application

The service is available on all views via `this.formatDate` and is commonly used for displaying publication dates, timestamps, and other date-related information in templates.

## Key Features

- **Luxon-powered formatting** with comprehensive pattern support
- **Default human-readable format** (`'LLL dd, yyyy'`) for common use cases
- **ISO date format support** for HTML `datetime` attributes
- **Flexible pattern system** supporting various date components and styles
- **Internationalization ready** through Luxon's locale system

## Examples

### Basic Date Formatting

```javascript
// Using the default format
export default {
    async render(){
        const post = await this.database.posts.first();
        
        return this.renderHtml`
            <p>Published: ${this.formatDate(post.publishedAt)}</p>
        `;
        // Output: "Published: Jul 01, 2023"
    }
}
```

### HTML Time Element with Datetime Attribute

```javascript
// Creating semantic HTML time elements
export default {
    async render(){
        const post = await this.database.posts.first();
        
        return this.renderHtml`
            <time 
                datetime="${this.formatDate(post.publishedAt, 'yyyy-MM-dd')}" 
                data-test-id="post-published-at"
            >
                ${this.formatDate(post.publishedAt)}
            </time>
        `;
        // Output: <time datetime="2023-07-01">Jul 01, 2023</time>
    }
}
```

### Various Format Patterns

```javascript
export default {
    async render(){
        const now = new Date();
        
        return this.renderHtml`
            <div>
                <!-- Default format -->
                <p>Default: ${this.formatDate(now)}</p>
                <!-- Output: "Jul 01, 2023" -->
                
                <!-- ISO date format -->
                <p>ISO Date: ${this.formatDate(now, 'yyyy-MM-dd')}</p>
                <!-- Output: "2023-07-01" -->
                
                <!-- Full date with time -->
                <p>Full DateTime: ${this.formatDate(now, 'LLL dd, yyyy TT')}</p>
                <!-- Output: "Jul 01, 2023 2:30 PM" -->
                
                <!-- Compact date -->
                <p>Compact: ${this.formatDate(now, 'MMM dd, yyyy')}</p>
                <!-- Output: "Jul 01, 2023" -->
                
                <!-- Date with time (12-hour) -->
                <p>With Time: ${this.formatDate(now, "LLL dd, yyyy 'at' hh:mm a")}</p>
                <!-- Output: "Jul 01, 2023 at 02:30 PM" -->
                
                <!-- Short date and time -->
                <p>Short: ${this.formatDate(now, 'MMM dd HH:mm')}</p>
                <!-- Output: "Jul 01 14:30" -->
            </div>
        ';
    }
}
```

### Comments and Timestamps

```javascript
// Formatting comment creation dates
export default {
    async render(){
        const comments = await this.database.comments.all();
        
        return this.renderHtml`
            <div class="comments">
                ${comments.map(comment => this.renderHtml`
                    <div class="comment">
                        <div class="comment-meta">
                            <span class="author">${comment.user.name}</span>
                            <span class="timestamp">
                                ${this.formatDate(comment.createdAt, "LLL dd, yyyy 'at' hh:mm a")}
                            </span>
                        </div>
                        <div class="content">${comment.body}</div>
                    </div>
                `)}
            </div>
        `;
    }
}
```

### Table Data Formatting

```javascript
// Formatting dates in data tables
export default {
    async render(){
        return this.renderTable(this.database.posts, {
            columns: [
                { name: 'title' },
                { 
                    name: 'publishedAt',
                    cell: ({ publishedAt }) => this.formatDate(publishedAt, 'MMM dd, yyyy')
                },
                {
                    name: 'createdAt', 
                    cell: ({ createdAt }) => this.formatDate(createdAt, 'LLL dd, yyyy TT')
                }
            ]
        });
    }
}
```

### Admin Interface Revisions

```javascript
// Showing revision timestamps in admin interfaces
export default {
    async render(){
        const revisions = await this.database.revisions
            .where({ revisableType: 'Post', revisableId: this.params.id })
            .orderBy('createdAt', 'desc');
            
        return this.renderTable(revisions, {
            columns: [
                {
                    name: 'createdAt',
                    cell: row => this.renderHtml`
                        ${this.formatDate(row.createdAt, 'LLL dd, yyyy TT')}
                    `
                },
                { name: 'field' },
                { name: 'oldValue' },
                { name: 'newValue' }
            ]
        });
    }
}
```

## Format Pattern Reference

The service uses Luxon's format patterns. Here are commonly used patterns:

### Date Components
- `yyyy` - 4-digit year (2023)
- `MM` - 2-digit month (07) 
- `MMM` - Short month name (Jul)
- `LLL` - Long month name (July)
- `dd` - 2-digit day (01)

### Time Components  
- `HH` - 24-hour hour (14)
- `hh` - 12-hour hour (02)
- `mm` - Minutes (30)
- `ss` - Seconds (45)
- `a` - AM/PM (PM)
- `TT` - Short time format (2:30 PM)

### Common Patterns
- `'LLL dd, yyyy'` - Default format: "Jul 01, 2023"
- `'yyyy-MM-dd'` - ISO date: "2023-07-01"
- `'MMM dd, yyyy'` - Compact: "Jul 01, 2023"
- `'LLL dd, yyyy TT'` - With time: "Jul 01, 2023 2:30 PM"
- `"LLL dd, yyyy 'at' hh:mm a"` - Conversational: "Jul 01, 2023 at 02:30 PM"
- `'MMM dd HH:mm'` - Short with 24h time: "Jul 01 14:30"

## Common Use Cases

### Content Publishing
- **Post publication dates**: Display when articles were published
- **Page timestamps**: Show last modified dates for pages
- **Comment timestamps**: Format comment creation times
- **Archive listings**: Format dates in content archives

### Admin Interfaces  
- **Revision tracking**: Show when content was modified
- **User activity**: Display login times and account creation dates
- **System logs**: Format timestamps in administrative views
- **Data tables**: Present date columns in consistent formats

### HTML Semantics
- **Time elements**: Provide machine-readable datetime attributes
- **Structured data**: Format dates for search engine optimization
- **Accessibility**: Ensure dates are properly formatted for screen readers

## Performance Notes

- Date formatting is performed by Luxon's highly optimized DateTime class
- Format patterns are parsed and cached internally by Luxon
- The service creates minimal overhead as it's a thin wrapper around Luxon
- Memory usage is minimal as only the formatted string is returned

## Related Services

- **renderTag**: Often used together for creating semantic HTML time elements
- **renderTable**: Commonly used in cell formatters for date columns
- **renderHtml**: The primary context where formatDate is used for template interpolation