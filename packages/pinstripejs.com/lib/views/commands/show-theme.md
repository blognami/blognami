---
menus:
    sidebar: ["Commands", "show-theme"]
---
# show-theme Command

## Interface

```bash
pinstripe show-theme
```

This command takes no parameters.

## Description

Displays the current project theme configuration in JSON format. The command outputs the complete resolved theme object, including all design tokens, color palettes, typography settings, and computed values from the theme service.

## Example Output

```json
{
  "colors": {
    "red": {
      "50": "#fef2f2",
      "500": "#ef4444",
      "600": "#dc2626"
    },
    "blue": {
      "50": "#eff6ff",
      "500": "#3b82f6",
      "600": "#2563eb"
    },
    "semantic": {
      "primaryText": "#1f2937",
      "accent": "#3b82f6"
    }
  },
  "fonts": {
    "sans": "system-ui, -apple-system, sans-serif",
    "serif": "Georgia, serif"
  },
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px"
  }
}
```

## Use Cases

### Theme Development
- **Design token verification** - Confirm theme values during component development
- **Reference resolution** - View resolved values for theme references like `@colors.blue.500`
- **Theme debugging** - Troubleshoot theme configuration issues

### Component Styling
- **Color palette inspection** - See available colors for component styling
- **Breakpoint validation** - Check responsive design breakpoints
- **Typography review** - Verify font configurations

## Related Commands

- **`show-config`** - Display complete project configuration including theme
- **`list-views`** - List views that use theme styling
- **`generate-view`** - Create new views with theme-aware styling