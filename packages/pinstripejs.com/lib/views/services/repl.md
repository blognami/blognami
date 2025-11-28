---
menus:
    sidebar: ["Services", "repl"]
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

The `repl` service provides an interactive JavaScript environment with all Pinstripe services available. Start it via CLI for development and debugging.

## Usage

```bash
npx pinstripe start-repl
```

## Examples

### Database Exploration

```javascript
pinstripe > const db = await database
pinstripe > await db.users.count()
0

pinstripe > await db.users.insert({ name: 'Test', email: 'test@example.com' })
pinstripe > await db.users.count()
1
```

### Check Configuration

```javascript
pinstripe > const cfg = await config
pinstripe > cfg.database
{ adapter: 'sqlite', database: 'my_app_development.db' }
```

### Test Views

```javascript
pinstripe > const html = await renderView('users/index', { users: [] })
pinstripe > console.log(html)
```

### Project Info

```javascript
pinstripe > const proj = await project
pinstripe > proj.name
'my-app'

pinstripe > await environment
'development'
```

### Run Background Jobs

```javascript
pinstripe > await runBackgroundJob('send-newsletter')
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
