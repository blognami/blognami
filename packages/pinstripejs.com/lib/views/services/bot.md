---
menus:
    sidebar: ["Services", "bot"]
---
# bot

Cron-based background job scheduler.

## Interface

```javascript
this.bot.start()              // Start scheduler loop
this.bot.stop()               // Stop scheduler gracefully
this.bot.destroy()            // Alias for stop()
this.bot.runBackgroundJobs(unixTime)  // Run jobs for timestamp
```

## Description

The `bot` service runs a continuous loop checking for scheduled background jobs every second. Jobs are defined with cron expressions and execute in isolated workspace contexts. The bot starts automatically with the server unless `--without-bot` is specified.

## Examples

### Background Job Definition

```javascript
// lib/background_jobs/cleanup.js
export default {
    meta() {
        this.schedule('*/5 * * * *');  // Every 5 minutes
    },

    async run() {
        await this.database.sessions.where({
            lastAccessedAtLt: new Date(Date.now() - 30 * 60 * 1000)
        }).delete();
    }
};
```

### Multiple Schedules

```javascript
export default {
    meta() {
        this.schedule('*/5 * * * *');    // Every 5 minutes
        this.schedule('0 0 * * *');       // Daily at midnight
        this.schedule('0 9 * * 1');       // Monday at 9 AM
    },

    async run() {
        // Job logic
    }
};
```

### Manual Bot Control

```javascript
// Start manually
const loop = this.bot.start();

// Stop gracefully
await this.bot.stop();
```

## Cron Syntax

```
┌───────────── minute (0-59)
│ ┌─────────── hour (0-23)
│ │ ┌───────── day of month (1-31)
│ │ │ ┌─────── month (1-12)
│ │ │ │ ┌───── day of week (0-6)
* * * * *
```

Common patterns:
- `* * * * *` - Every minute
- `*/5 * * * *` - Every 5 minutes
- `0 2 * * *` - Daily at 2 AM
- `0 0 1 * *` - First of month at midnight

## Command Line

```bash
npx pinstripe start-server              # With bot (default)
npx pinstripe start-server --without-bot  # Without bot
npx pinstripe run-background-job --name cleanup  # Run manually
```

## Notes

- Each job runs in isolated workspace context
- Errors are logged but don't stop other jobs
- Jobs auto-retry on next scheduled time
- Use `multiTenant: true` for per-tenant execution
