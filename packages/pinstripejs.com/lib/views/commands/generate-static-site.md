---
sidebar:
    category: ["Commands", "generate-static-site"]
---
# generate-static-site Command

> **Note**: This command is implemented as part of the `@pinstripe/static-site` package and needs to be included in your project for it to be available.

## Interface

The command generates a static site from your Pinstripe application:

```bash
pinstripe generate-static-site
```

### Parameters

No parameters required.

### Examples

```bash
# Generate static site files
pinstripe generate-static-site

# Build script usage (common in package.json)
"build": "rm -rf build && pinstripe generate-static-site"
```

## Description

The `generate-static-site` command is a **static site generator** that creates deployable static files from your Pinstripe application by:

1. **Page discovery** - Finds all available view routes in your application
2. **Intelligent crawling** - Starts with discovered routes and follows internal links
3. **Content generation** - Renders each page using the callHandler service  
4. **File organization** - Saves static files with proper paths and extensions
5. **Asset handling** - Processes HTML, CSS, JS and other content types

## Generated File Structure

```
build/static/
├── index.html           # Root page (/)
├── about.html          # /about page
├── posts/
│   ├── index.html      # /posts/ listing page
│   └── my-post.html    # /posts/my-post individual page
├── assets/
│   ├── style.css       # Stylesheets
│   └── script.js       # JavaScript files
└── 404.html           # Error page
```

## Key Features

### Automatic Route Discovery
- Scans all view files to find available routes
- Excludes private views (prefixed with `_`)
- Always includes a 404 error page

### Intelligent Link Crawling
- Parses HTML content to find internal links
- Follows `href` and `src` attributes automatically
- Only processes same-domain links
- Prevents infinite loops and duplicate processing

### File Path Normalization
```javascript
// Route to file mapping examples
'/'           → 'index.html'
'/about'      → 'about.html' 
'/posts/'     → 'posts/index.html'
'/posts/123'  → 'posts/123.html'
```

### Content Type Handling
- **HTML pages** - Saved with `.html` extension
- **CSS files** - Saved with `.css` extension  
- **JavaScript** - Saved with `.js` extension
- **Other assets** - Extension determined by MIME type

## Common Use Cases

### Blog Deployment
```bash
# Clean and rebuild static site
rm -rf build && pinstripe generate-static-site

# Deploy to static hosting
rsync -av build/static/ user@server:/var/www/html/
```

### CI/CD Integration
```json
{
  "scripts": {
    "build": "pinstripe generate-static-site",
    "deploy": "npm run build && aws s3 sync build/static/ s3://my-bucket/"
  }
}
```

### Development Preview
```bash
# Generate static files for testing
pinstripe generate-static-site

# Serve locally for preview
cd build/static && python3 -m http.server 8000
```

## Related Commands

- **`start-server`** - Start development server to preview before generating
- **`generate-project`** - Create projects with `@pinstripe/static-site` dependency
- **`generate-view`** - Add new pages that will be included in static generation