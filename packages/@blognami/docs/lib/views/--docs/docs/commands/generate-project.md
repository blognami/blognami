---
section: docs
menu:
    path: ["Commands", "generate-project"]
---
# generate-project Command

## Interface

The command creates a new Blognami project with the following signature:

```bash
blognami generate-project <name> [--with <dependencies>]
```

### Parameters

- **`name`** (required) - The name of the project to create
- **`--with <dependencies>`** (optional) - Additional space-separated dependencies to include alongside `blognami`

### Examples

```bash
# Create a basic project
blognami generate-project my-blog

# Create a project with additional dependencies
blognami generate-project my-app --with "@blognami/main @blognami/pages"

# Create a project with multiple dependencies
blognami generate-project e-commerce --with "@blognami/main @blognami/posts @blognami/tags"
```

## Description

The `generate-project` command is a **project scaffolding tool** that creates a complete Blognami application with:

1. **Project structure** - Creates directory structure with `lib/` folder
2. **Package configuration** - Generates `package.json` with ES module settings
3. **Blognami configuration** - Sets up `blognami.config.js` with database and mail configurations
4. **Entry point** - Creates `lib/index.js` with imports and initialization
5. **Agent guide** - Writes a `CLAUDE.md` that imports the Blognami agent guide, `AGENT_GUIDE.md`, from `@blognami/docs`, so Claude Code loads it
6. **Documentation** - Generates basic `README.md`
7. **Dependency installation** - Automatically runs `npm install`
8. **Project initialization** - Runs `blognami initialize-project` to complete setup

## Generated Project Structure

```
project-name/
├── package.json           # NPM package configuration
├── blognami.config.js    # Blognami application configuration  
├── README.md              # Basic documentation
├── CLAUDE.md              # Imports the Blognami agent guide for Claude Code
├── lib/
│   └── index.js          # Main entry point
├── development.db        # SQLite database (created after initialization)
└── node_modules/         # Installed dependencies
```

## Key Features

### Automatic Dependency Management
- Always includes `blognami` as a core dependency
- Always installs `@blognami/bundler` as a devDependency, which provides `bundle-static-assets` and builds assets on the fly in development
- Always installs `@blognami/docs` as a devDependency, never a regular one, even when it is named in `--with`; the generated `CLAUDE.md` imports its `AGENT_GUIDE.md` with the line `@node_modules/@blognami/docs/AGENT_GUIDE.md`
- Accepts additional dependencies via `--with` parameter  
- Prevents duplicate dependencies in the dependency list
- Runs `npm install` automatically after generating files

### Environment-Specific Configuration
- **Development**: Uses SQLite database and dummy mail adapter
- **Production**: Configured for MySQL database and SMTP mail delivery
- Environment detection via `NODE_ENV` environment variable

### Database Configuration
```javascript
// Development (default)
database: {
    adapter: 'sqlite',
    filename: 'development.db'
}

// Production  
database: {
    adapter: 'mysql',
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'project_name_production'
}
```

### Mail Configuration
```javascript
// Development (default)
mail: {
    adapter: 'dummy'  // No actual emails sent
}

// Production
mail: {
    adapter: 'smtp',
    host: "smtp.example.com",
    port: 465,
    secure: true,
    auth: {
        user: "username",
        pass: "password"
    }
}
```

## Common Dependency Combinations

### Blog Projects
```bash
# Minimal blog
--with "@blognami/main @blognami/posts"

# Blog with pages and tags  
--with "@blognami/main @blognami/posts @blognami/pages @blognami/tags"

# Full-featured blog with documentation
--with "@blognami/main @blognami/posts @blognami/pages @blognami/tags"
```

### Application Projects
```bash
# Basic web application
--with "@blognami/main @blognami/static-site"

# Multi-tenant application
--with "@blognami/main @blognami/multi-tenant"

# Application with utilities and database features
--with "@blognami/main @blognami/utils @blognami/database"
```

## Related Commands

- **`initialize-project`** - Sets up database and project structure (run automatically)
- **`generate-service`** - Add business logic services to the project
- **`generate-view`** - Add web views and controllers  
- **`generate-command`** - Add CLI commands to the project
- **`generate-background-job`** - Add scheduled tasks and jobs
- **`start-server`** - Start the development or production server
- **`initialize-database`** - Set up database schema and initial data