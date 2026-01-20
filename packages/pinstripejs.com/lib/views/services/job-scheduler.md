---
menu:
    path: ["Services", "jobScheduler"]
---
# jobScheduler

Cron-based scheduler that queues jobs.

## Interface

```javascript
this.jobScheduler.start()    // Start scheduler loop
this.jobScheduler.stop()     // Stop scheduler gracefully
this.jobScheduler.destroy()  // Alias for stop()
this.jobScheduler.scheduleJobs(unixTime)  // Queue jobs for timestamp
```

## Description

The `jobScheduler` service runs a continuous loop checking for scheduled jobs every second. When a job's cron expression matches the current time, the scheduler pushes the job to `jobQueue`. The scheduler starts automatically with the server unless `--without-jobs` is specified.

## Examples

### Job Definition

```javascript
// lib/jobs/cleanup.js
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

### Manual Control

```javascript
// Start manually
const loop = this.jobScheduler.start();

// Stop gracefully
await this.jobScheduler.stop();
```

## Cron Syntax

```
minute (0-59)
| hour (0-23)
| | day of month (1-31)
| | | month (1-12)
| | | | day of week (0-6)
* * * * *
```

Common patterns:
- `* * * * *` - Every minute
- `*/5 * * * *` - Every 5 minutes
- `0 2 * * *` - Daily at 2 AM
- `0 0 1 * *` - First of month at midnight

## Notes

- Scheduler only queues jobs; `jobWorker` executes them
- Uses `cron-parser` for expression parsing
- Loop checks every 1 second
