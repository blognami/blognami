---
menu:
    path: ["Commands", "start-repl"]
---
# start-repl Command

## Interface

The command starts an interactive REPL session with the following signature:

```bash
blognami start-repl
```

### Parameters

No parameters required.

### Examples

```bash
# Start an interactive REPL session
blognami start-repl

# The REPL provides a prompt for interactive JavaScript execution
blognami > 
```

## Description

The `start-repl` command is a **development tool** that launches an interactive Read-Eval-Print Loop (REPL) environment for exploring and debugging Blognami applications. It provides:

1. **Interactive JavaScript environment** - Full JavaScript execution with async/await support
2. **Service injection** - All registered services automatically available as global variables
3. **Database exploration** - Interactive database queries and operations
4. **Configuration inspection** - Access to application configuration and settings
5. **View testing** - Test view rendering with different parameters
6. **Command execution** - Run commands interactively via `runCommand()`

## Key Features

### Automatic Service Access
All registered services are available as global variables:
```javascript
blognami > const db = await database
blognami > await db.users.count()
5

blognami > const cfg = await config
blognami > cfg.database
{ adapter: 'sqlite', filename: 'development.db' }
```

### Async/Await Support
Full support for asynchronous operations:
```javascript
blognami > const users = await database.then(db => db.users.limit(5).all())
blognami > users.length
5
```

### Command Integration
Execute commands directly from the REPL:
```javascript
blognami > await runCommand('list-services')
blognami > await runCommand('generate-service', { name: 'notification' })
```

### Interactive Development
Test and prototype features in real-time:
```javascript
blognami > const html = await renderView('users/index', { users: [] })
blognami > console.log(html)
```

## Common Usage Patterns

### Database Exploration
```javascript
// Inspect database contents
blognami > const db = await database
blognami > await db.users.where({ active: true }).count()
blognami > await db.posts.orderBy('created_at', 'desc').limit(10).all()
```

### Service Testing
```javascript
// Test service functionality
blognami > await runBackgroundJob('maintenance')
blognami > const proj = await project
blognami > proj.name
```

### Configuration Debugging
```javascript
// Check application settings
blognami > await environment
'development'
blognami > const cfg = await config
blognami > cfg.server.port
```

## Exit Commands

- **Ctrl+C** - Exit the REPL session
- **`.exit`** - Alternative exit command

## Related Commands

- **`list-services`** - View all available services that can be accessed in the REPL
- **`show-config`** - Display configuration that can be inspected via `config`
- **`start-server`** - Start the web server (can be done from within REPL)

## Use Cases

- **Development debugging** - Interactive exploration of application state
- **Service testing** - Test service APIs before writing application code
- **Data inspection** - Examine database contents and relationships
- **Feature prototyping** - Rapidly test new functionality
- **Configuration validation** - Verify application settings and service setup