---
menus:
    sidebar: ["Commands", "generate-project"]
---
# generate-project Command

## Interface

The command creates a new Pinstripe project with the following signature:

```bash
pinstripe generate-project <name> [--with <dependencies>]
```

### Parameters

- **`name`** (required) - The name of the project to create
- **`--with <dependencies>`** (optional) - Additional space-separated dependencies to include alongside `pinstripe`

### Examples

```bash
# Create a basic project
pinstripe generate-project my-blog

# Create a project with additional dependencies
pinstripe generate-project my-app --with "@blognami/main @blognami/pages"

# Create a project with multiple dependencies
pinstripe generate-project e-commerce --with "@blognami/main @blognami/posts @blognami/tags"
```

## Description

The `generate-project` command is a **project scaffolding tool** that creates a complete Pinstripe application with:

1. **Project structure** - Creates directory structure with `lib/` folder
2. **Package configuration** - Generates `package.json` with ES module settings
3. **Pinstripe configuration** - Sets up `pinstripe.config.js` with database and mail configurations
4. **Entry point** - Creates `lib/index.js` with imports and initialization
5. **Documentation** - Generates basic `README.md`
6. **Dependency installation** - Automatically runs `npm install`
7. **Project initialization** - Runs `pinstripe initialize-project` to complete setup

## Generated Project Structure

```
project-name/
├── package.json           # NPM package configuration
├── pinstripe.config.js    # Pinstripe application configuration  
├── README.md              # Basic documentation
├── lib/
│   └── index.js          # Main entry point
├── development.db        # SQLite database (created after initialization)
└── node_modules/         # Installed dependencies
```

## Key Features

### Automatic Dependency Management
- Always includes `pinstripe` as a core dependency
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
--with "@blognami/main @pinstripe/static-site"

# Multi-tenant application
--with "@blognami/main @pinstripe/multi-tenant"

# Application with utilities and database features
--with "@blognami/main @pinstripe/utils @pinstripe/database"
```

## Related Commands

- **`initialize-project`** - Sets up database and project structure (run automatically)
- **`generate-service`** - Add business logic services to the project
- **`generate-view`** - Add web views and controllers  
- **`generate-command`** - Add CLI commands to the project
- **`generate-background-job`** - Add scheduled tasks and jobs
- **`start-server`** - Start the development or production server
- **`initialize-database`** - Set up database schema and initial data