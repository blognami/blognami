# Blognami Codebase Guide

## Project Overview

This is a **monorepo** containing:
- **Blognami**: An open-source, passwordless blogging platform
- **Pinstripe**: The full-stack JavaScript framework powering Blognami

## Quick Reference

### Running the Project
```bash
npm run start           # Start demo project (http://127.0.0.1:3000)
npm run watch           # Start with auto-reload
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # Playwright E2E tests
npm run test:models     # Model tests
npm run test:services   # Service tests
```

### CLI Commands (via `npx pinstripe`)
```bash
npx pinstripe start-server      # Run dev server
npx pinstripe generate-view     # Create a new view
npx pinstripe generate-command  # Create a new command
npx pinstripe generate-service  # Create a new service
npx pinstripe list-views        # List all views
npx pinstripe list-commands     # List all commands
npx pinstripe list-services     # List all services
```

## Package Structure

```
packages/
├── pinstripe/              # Core framework + CLI
├── @pinstripe/
│   ├── database/           # MySQL/SQLite database layer
│   ├── utils/              # Meta-programming utilities
│   ├── window/             # Browser-side framework
│   ├── markdown/           # Markdown processing
│   ├── one-time-token/     # Passwordless auth
│   ├── multi-tenant/       # Multi-tenancy
│   └── static-site/        # Static site generation
├── @blognami/
│   ├── main/               # Core Blognami app
│   ├── posts/              # Blog posts
│   ├── pages/              # Static pages
│   └── tags/               # Tagging system
├── blognami/               # Meta-package (bundles all @blognami/*)
├── demo/                   # Example project with tests
├── blognami.com/           # Marketing site
└── pinstripejs.com/        # Framework docs
```

## Architecture Patterns

### Models (in `lib/models/`)

Models are plain objects with a `meta()` method for configuration:

```javascript
export default {
    meta(){
        // Mixins
        this.include('pageable');
        this.include('tagable');

        // Relationships
        this.belongsTo('user');
        this.hasMany('comments');

        // Validations
        this.mustNotBeBlank('title');
        this.mustBeAValidEmail('email');
        this.mustBeUnique('email');

        // Hooks
        this.addHook('beforeInsert', function(){
            // ...
        });
        this.addHook('beforeValidation', function(){
            // ...
        });
    },

    // Instance methods
    get someComputed(){
        return this.field || 'default';
    },

    async someMethod(){
        // ...
    }
};
```

### Views (in `lib/views/`)

Views render HTML with scoped CSS:

```javascript
export const styles = `
    .root {
        background: #fff;
    }
    .title {
        font-size: 2rem;
    }
`;

export default {
    async render(){
        const { title, body } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <h1 class="${this.cssClasses.title}">${title}</h1>
                ${this.renderView('_other-view', { body })}
            </div>
        `;
    }
};
```

- View names starting with `_` are partials (e.g., `_layout.js`, `_button.js`)
- Use `this.renderView()` to render other views
- Use `this.renderHtml` tagged template for HTML output
- CSS classes are auto-scoped via `this.cssClasses`

#### Responsive Styles with Theme

For responsive styles, use a function that receives the theme and use `breakpointFor` for mobile-first media queries:

```javascript
export const styles = ({ colors, breakpointFor }) => `
    .root {
        padding: 1.6rem;
        color: ${colors.gray[700]};
    }

    ${breakpointFor('md')} {
        .root {
            padding: 2.4rem;
        }
    }
`;
```

Available breakpoints: `sm` (40rem), `md` (48rem), `lg` (64rem), `xl` (80rem), `2xl` (96rem)

### Theme System

The theme provides centralized design tokens for consistent styling across the app.

#### How Styles Receive Theme

When `styles` is a function, it receives the resolved theme object:

```javascript
export const styles = ({ colors, fonts, breakpointFor }) => `
    .root {
        font-family: ${fonts.sans};
        color: ${colors.semantic.primaryText};
        background: ${colors.gray[50]};
    }
`;
```

#### Key Theme Properties

- **colors**: Color palettes (gray, red, blue, etc.) with shades 50-950, plus `colors.semantic` for theme-aware colors
- **fonts**: `sans`, `serif`, `mono`
- **breakpoints**: `sm`, `md`, `lg`, `xl`, `2xl`
- **spacing**, **radius**, **shadow**: Design tokens for consistent spacing/styling
- **breakpointFor(name)**: Returns `@media (min-width: ...)` for mobile-first responsive design

#### View-Specific Theme Tokens

Views can define component-specific tokens that reference global theme values:

```javascript
export const theme = {
    colors: {
        primaryBackground: '@colors.lime.500',
        primaryHoverBackground: '@colors.lime.600',
    }
};

export const styles = ({ views }) => `
    .root {
        background: ${views['_my-view'].colors.primaryBackground};
    }
`;
```

#### CSS Class Scoping

CSS classes are automatically scoped per-view using a hash of the view name:
- `.root` in view `_navbar` becomes `.view-abc123-root`
- Access via `this.cssClasses.root` in the render method
- Prevents style conflicts between views

#### Theme Configuration

Override theme values in `pinstripe.config.js`:

```javascript
export default {
    theme: {
        colors: {
            semantic: {
                accent: '@colors.blue.500'
            }
        }
    }
};
```

### Services (in `lib/services/`)

Services are singletons with a `create()` method:

```javascript
export default {
    meta(){
        this.addToClient(); // Make available in browser
    },

    create(){
        return this.defer(() => (...args) => {
            // Service implementation
        });
    }
};
```

### Commands (in `lib/commands/`)

CLI commands with parameter handling:

```javascript
export default {
    meta(){
        this.annotate({
            description: 'Does something useful.'
        });
        this.hasParam('name', { type: 'string', description: 'The name' });
    },

    async run(){
        const { name } = this.params;
        // Command implementation
    }
};
```

## File Naming Conventions

- **snake_case** for filenames: `user.js`, `send_mail.js`, `generate_view.js`
- **_file_importer.js**: Defines which registry handles files in that directory
- **_prefix**: Partials/private views: `_layout.js`, `_button.js`

## Auto-Import and Registration System

The framework uses `importAll()` to automatically discover and register classes (models, views, services, commands) without explicit imports.

### How it works

1. **Entry point**: Each package calls `importAll(import.meta.url)` in its `lib/index.js`

2. **Directory scanning**: `importAll` recursively scans directories for files

3. **`_file_importer.js` determines the registry**: Each directory has a `_file_importer.js` that exports a registry class:
   ```javascript
   // lib/views/_file_importer.js
   export { View as default } from 'pinstripe';

   // lib/services/_file_importer.js
   export { ServiceFactory as default } from 'pinstripe';

   // lib/models/_file_importer.js
   export { Row as default } from '@pinstripe/database';
   ```

4. **File importers by extension**: Each registry has a `FileImporter` sub-registry that handles different file types:
   - `.js` files: Import the module, register `default` export as a mixin
   - `.md` files: Parse YAML front matter + markdown body, create a view that renders markdown

5. **Registration**: Files are registered by their relative path (without extension):
   - `lib/views/_layout.js` → `View.for('_layout')`
   - `lib/models/user.js` → `Row.for('user')` (accessed as `database.users`)
   - `lib/services/send_mail.js` → `ServiceFactory.for('sendMail')`

### Extension-based file importers

New file types can be supported by registering a file importer:

```javascript
// In @pinstripe/markdown/lib/view_file_importers/md.js
View.FileImporter.register('md', {
    async importFile(){
        const data = await readFile(this.filePath, 'utf8');
        const [frontMatter, body] = this.extractFrontMatterAndBody(data);

        View.register(this.relativeFilePathWithoutExtension, {
            meta(){
                this.annotate(frontMatter);
            },
            render(){
                return this.renderMarkdown(body);
            }
        });
    }
});
```

### Key registries

- **`View`**: HTML views (`.js`, `.md` files in `lib/views/`)
- **`ServiceFactory`**: Services (`.js` files in `lib/services/`)
- **`Row`**: Database models (`.js` files in `lib/models/`)
- **`Command`**: CLI commands (`.js` files in `lib/commands/`)
- **`Job`**: Jobs (`.js` files in `lib/jobs/`)

## Key Services Available

- `this.database` - Database queries
- `this.renderHtml` - HTML rendering
- `this.renderView(name, params)` - Render a view
- `this.renderText(fn)` - Render plain text
- `this.sendMail(options)` - Send email
- `this.params` - Request/command parameters
- `this.workspace` - Current workspace context
- `this.fsBuilder` - File system operations (in commands)

## Testing Patterns

Tests use Node.js built-in test runner:

```javascript
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';
import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test('description', () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    await users.insert({ name: 'Test', email: 'test@example.com', role: 'user' });
    assert.equal(await users.count(), 1);
}));
```

## Common Mixins

- **pageable**: Pagination support for models
- **tagable**: Tagging functionality
- **commentable**: Comments support
- **revisable**: Revision/history tracking
- **subscribable**: Subscription patterns

## Database Operations

```javascript
// In models/services/commands
const { users, posts, tags } = this.database;

// Insert
const user = await users.insert({ name: 'Test', email: 'test@example.com' });

// Query
const user = await users.where({ email: 'test@example.com' }).first();
const allUsers = await users.all();
const count = await users.count();

// Update
await user.update({ name: 'New Name' });

// Delete
await user.delete();

// Relationships
const userPosts = await user.posts.all();
```

## Test Location

Unit tests live next to the code they test (e.g., `lib/command.test.js` tests `lib/command.js`).

Integration/feature tests live in `packages/demo/tests/` organized by type:
- `models/` - Model tests (e.g., `user.test.js`)
- `services/` - Service tests
- `cli/` - CLI command tests
- `e2e/` - Playwright end-to-end tests

## Commit Style

Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, etc.
No generated-by footers.

## Ralph / PRD

Ralph is an automated task runner that uses Claude to implement tasks from `prd.json`.

### PRD Schema (`prd.json`)

```json
[
  {
    "category": "functional | non-functional | bug | ...",
    "description": "What needs to be done",
    "steps": ["verification step 1", "verification step 2"],
    "passes": false
  }
]
```

- **category**: Task type (string)
- **description**: What to implement (string)
- **steps**: How to verify it's done (array of strings)
- **passes**: Whether the task is complete (boolean) — set to `true` after implementing and tests pass

### Claude Sandbox (Docker)

- `npm run claude-sandbox` — Launch interactive Claude in Docker with `bypassPermissions`
- `npm run claude-sandbox:build` — Build the Docker image only
- `npm run claude-sandbox:token` — Set up Claude auth token
- `npm run claude-sandbox:clean` — Remove the named volume for node_modules (use when deps change)
- `npm run claude-sandbox:shell` — Bash shell in the container

Mounts the project as a volume so git commits appear on the host. Uses a named volume (`blognami-claude-sandbox-nm`) for `node_modules` to avoid macOS/Linux binary incompatibility.

### Running Ralph

- `npm run ralph` — AFK mode (runs Ralph in Docker sandbox, default 10 iterations)
- `npm run ralph:once` — Single iteration in Docker
- `npm run test:quick` — Runs all tests with e2e filtered to smoke tests only

Set `RALPH_ITERATIONS` env var to control iteration count (default 10).

## Important Notes

- All packages use ES modules (`"type": "module"`)
- No Express/Fastify - uses native Node.js HTTP
- Database supports MySQL and SQLite via adapters
