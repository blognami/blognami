---
menu:
    path: ["Services", "theme"]
---
# theme

Access design tokens and theming utilities.

## Interface

```javascript
const theme = await this.theme;

theme.colors.blue[500]
theme.fonts.sans
theme.breakpointFor('md')
theme.remify(32)
```

## Methods

| Method | Description |
|--------|-------------|
| `deepMerge(variables)` | Merge additional tokens into theme |
| `resolveReferences()` | Resolve `@property.path` references |
| `getNestedProperty(path)` | Get nested value by dot notation |
| `breakpointFor(name)` | Generate `@media (min-width: ...)` |
| `remify(px)` | Convert pixels to rem (px/16) |

## Description

The `theme` service provides centralized design tokens including colors, typography, spacing, and breakpoints. In view styles, the theme is automatically passed as a parameter.

## Default Tokens

- **colors**: Color palettes with 50-950 shades (red, blue, gray, etc.)
- **fonts**: `sans`, `serif`, `mono`
- **breakpoints**: `sm`, `md`, `lg`, `xl`, `2xl`
- **spacing**, **radius**, **shadow**: Design system values

## Examples

### In View Styles

```javascript
export const styles = ({ colors, fonts, breakpointFor }) => `
    .header {
        color: ${colors.semantic.primaryText};
        font-family: ${fonts.sans};
        background: ${colors.blue[50]};
    }

    ${breakpointFor('md')} {
        .header {
            font-size: 2rem;
        }
    }
`;
```

### Configuration

```javascript
// pinstripe.config.js
export default {
    theme: {
        colors: {
            brand: {
                primary: '#0066cc'
            },
            semantic: {
                accent: '@colors.brand.primary'
            }
        }
    }
};
```

### View-Specific Tokens

```javascript
export const theme = {
    card: {
        background: '@colors.white',
        radius: '@radius.lg'
    }
};

export const styles = ({ views }) => `
    .card {
        background: ${views['_my-view'].card.background};
        border-radius: ${views['_my-view'].card.radius};
    }
`;
```

## CLI

```bash
npx pinstripe show-theme
```

## Notes

- Theme passed automatically to style functions
- Use `@property.path` syntax for reference tokens
- CSS classes are auto-scoped per view via hashing
