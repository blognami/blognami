---
sidebar:
    category: ["Commands", "generate-view"]
---
# generate-view Command

## Interface

```bash
pinstripe generate-view <name>
```

### Parameters

- **`name`** (required) - The name of the view to create (adds `.js` extension by default)

### Examples

```bash
# Create a basic view
pinstripe generate-view home

# Create a view with specific extension
pinstripe generate-view contact.js

# Create a nested view
pinstripe generate-view admin/dashboard
```

## Description

The `generate-view` command creates new view files in the `lib/views/` directory. Views handle web requests and render HTML responses in Pinstripe applications.

## Generated Files

```
lib/views/
├── _file_importer.js     # Auto-generated View import (created once)
└── view-name.js          # Your new view file
```

## Generated View Structure

The command creates a view with:

- **CSS styles** - Basic styling with a `.root` class
- **Render method** - HTML template rendering using `renderHtml`
- **Default content** - Placeholder heading with the view name

### Example Generated Code

```javascript
export const styles = `
    .root {
        background: yellow;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <h1>home view</h1>
            </div>
        `;
    }
};
```

## Smart File Handling

- **Extension detection** - Uses `.js` by default, preserves existing extensions
- **Existing files** - If view already exists, preserves the existing content
- **Auto-import setup** - Creates `_file_importer.js` if it doesn't exist

## Related Commands

- **`list-views`** - Show all existing views in the project
- **`start-server`** - Start server to test your views
- **`generate-service`** - Create business logic to support your views