---
sidebar:
    category: ["Services", "theme"]
---
# theme Service

The `theme` service provides access to design tokens and theming utilities for styling components in Pinstripe applications. It manages a centralized theme configuration that includes colors, typography, spacing, breakpoints, and other design system values.

## Interface

The theme service returns a deferred promise that resolves to a Theme instance with the following methods:

### Core Methods

- **`deepMerge(variables)`** - Deeply merges additional design tokens into the theme
- **`resolveReferences()`** - Resolves reference tokens (e.g., `@colors.red.500`) to their actual values
- **`getNestedProperty(path)`** - Gets a nested property value using dot notation
- **`breakpointFor(minWidthProperty)`** - Generates CSS media query for a breakpoint
- **`remify(value)`** - Converts pixel values to rem units (divides by 16)

### Static Methods

- **`Theme.defineDesignTokens(designTokens)`** - Defines design tokens that are merged into all theme instances

## Default Design Tokens

The theme service comes with comprehensive default design tokens including:

- **Colors**: Full color palette with 50-950 shades for each color (red, blue, green, etc.)
- **Typography**: Font families, sizes, weights, line heights, letter spacing
- **Spacing**: Base spacing unit and modular scale
- **Breakpoints**: Responsive breakpoints (sm, md, lg, xl, 2xl)
- **Shadows**: Box shadows, inset shadows, drop shadows, text shadows
- **Borders**: Border radius values
- **Animations**: Easing functions and keyframe animations
- **Layout**: Container sizes and aspect ratios

## Usage

### Basic Usage

Access the theme in views and services:

```javascript
export default {
    async render() {
        const theme = await this.theme;
        const primaryColor = theme.colors.blue[500];
        return this.renderHtml`<div style="color: ${primaryColor}">Hello</div>`;
    }
};
```

### Using in Styles

The most common usage is in view styles where the theme is passed as a parameter:

```javascript
export const styles = ({ colors, fonts, breakpoints }) => `
    .header {
        color: ${colors.semantic.primaryText};
        font-family: ${fonts.sans};
        background-color: ${colors.blue[50]};
        border-bottom: 1px solid ${colors.gray[200]};
    }
    
    .accent {
        color: ${colors.semantic.accent};
    }
    
    @media (min-width: ${breakpoints.md}) {
        .header {
            font-size: 2rem;
        }
    }
`;
```

### Resolving References

Use reference tokens for consistency and easier theming:

```javascript
export default {
    async render() {
        const theme = await this.theme.resolveReferences();
        // If theme has { accent: "@colors.pink.600" }, this resolves to the actual color value
        const accentColor = theme.accent;
        return this.renderHtml`<div style="color: ${accentColor}">Accent text</div>`;
    }
};
```

### Custom Configuration

Configure custom theme values in your `pinstripe.config.js`:

```javascript
export default {
    theme: {
        colors: {
            brand: {
                primary: '#0066cc',
                secondary: '#6c757d'
            },
            semantic: {
                accent: '@colors.brand.primary'
            }
        },
        fonts: {
            display: 'Georgia, serif'
        }
    }
};
```

### Breakpoint Utilities

Generate responsive CSS with breakpoint helpers:

```javascript
export const styles = (theme) => `
    .container {
        width: 100%;
        padding: 1rem;
    }
    
    ${theme.breakpointFor('md')} {
        .container {
            max-width: ${theme.containers.lg};
            margin: 0 auto;
        }
    }
`;
```

### Utility Functions

Use built-in utility functions for common operations:

```javascript
export const styles = (theme) => `
    .spacing {
        margin: ${theme.remify(32)}; /* Converts 32px to 2rem */
        padding: ${theme.getNestedProperty('spacing')};
    }
`;
```

### Extending Themes

Add design tokens programmatically:

```javascript
// In a service or initialization file
import { Theme } from 'pinstripe';

Theme.defineDesignTokens({
    components: {
        button: {
            borderRadius: '@radius.md',
            padding: '0.75rem 1.5rem'
        }
    }
});
```

### Component-Specific Themes

Define component-specific design tokens that are automatically scoped:

```javascript
// In a view file
export const theme = {
    card: {
        background: '@colors.white',
        shadow: '@shadow.md',
        radius: '@radius.lg'
    }
};

export const styles = ({ views }) => `
    .card {
        background: ${views.components.card.background};
        box-shadow: ${views.components.card.shadow};
        border-radius: ${views.components.card.radius};
    }
`;
```

### Advanced Theme Customization

Create dynamic themes based on runtime conditions:

```javascript
export default {
    create() {
        return this.defer(async () => {
            const baseTheme = await this.config.theme || {};
            const userPreferences = await this.getUserPreferences();
            
            return Theme.new()
                .deepMerge(baseTheme)
                .deepMerge({
                    colors: {
                        semantic: {
                            accent: userPreferences.accentColor || '@colors.blue.600'
                        }
                    }
                })
                .resolveReferences();
        });
    }
};
```

### Command Line Usage

View the current theme configuration:

```bash
pinstripe show_theme
```

This outputs the complete resolved theme as JSON, useful for debugging and understanding the current design token values.

## Integration with Styling System

The theme service integrates seamlessly with Pinstripe's styling system:

1. **Style Functions**: Theme is automatically passed to style functions as the first parameter
2. **Reference Resolution**: The `@property.path` syntax automatically resolves to theme values
3. **CSS Processing**: Styles are processed through PostCSS with autoprefixing and optimization
4. **Component Scoping**: CSS classes are automatically scoped to prevent naming conflicts

## Best Practices

1. **Use Semantic Colors**: Prefer semantic color names (`colors.semantic.accent`) over specific color values
2. **Reference Tokens**: Use reference tokens (`@colors.blue.500`) for consistency and easy theming
3. **Responsive Design**: Leverage breakpoint utilities for consistent responsive behavior
4. **Component Tokens**: Define component-specific tokens for reusable styling patterns
5. **Configuration**: Keep theme customizations in `pinstripe.config.js` for environment-specific theming

The theme service provides a powerful foundation for building consistent, maintainable, and customizable user interfaces in Pinstripe applications.