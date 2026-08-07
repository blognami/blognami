---
menu:
    path: ["Services", "repl"]
---
# repl

Interactive REPL for exploring and debugging.

## Interface

```javascript
await this.repl.start()
```

### Returns

- Promise that resolves when REPL session ends

## Description

The `repl` service provides an interactive JavaScript environment with all Blognami services available. Start it via CLI for development and debugging.

## Usage

```bash
npx blognami start-repl
```

## Examples

### Database Exploration

```javascript
blognami > const db = await database
blognami > await db.users.count()
0

blognami > await db.users.insert({ name: 'Test', email: 'test@example.com' })
blognami > await db.users.count()
1
```

### Check Configuration

```javascript
blognami > const cfg = await config
blognami > cfg.database
{ adapter: 'sqlite', database: 'my_app_development.db' }
```

### Test Views

```javascript
blognami > const html = await renderView('users/index', { users: [] })
blognami > console.log(html)
```

### Project Info

```javascript
blognami > const proj = await project
blognami > proj.name
'my-app'

blognami > await environment
'development'
```

### Run Background Jobs

```javascript
blognami > await runBackgroundJob('send-newsletter')
```

## Features

- All registered services available as variables
- Full async/await support
- Custom object inspection (`__inspect` methods)
- VM context isolation

## Notes

- Development tool only, not for production
- Exit with Ctrl+C or `.exit`
- Services accessed same as in application code
