---
menus:
    sidebar: ["Commands", "list-views"]
---
# list-views Command

## Interface

```bash
pinstripe list-views
```

This command takes no parameters.

## Description

Lists all available views in the current Pinstripe project. Views are the web controllers and templates that handle HTTP requests and render responses.

## Example Output

```
The following views are available:

  * admin/comments
  * admin/posts
  * admin/users
  * public/home
  * public/posts
```

## Related Commands

- **`generate-view`** - Create new views for handling web requests
- **`list-services`** - List available business logic services
- **`list-commands`** - List all available Pinstripe commands