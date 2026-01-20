---
menu:
    path: ["Services", "jobWorker"]
---
# jobWorker

Queue processor that executes jobs.

## Interface

```javascript
this.jobWorker.start()         // Start worker loop
this.jobWorker.stop()          // Stop worker gracefully
this.jobWorker.destroy()       // Alias for stop()
this.jobWorker.processQueue()  // Process all pending jobs
```

## Description

The `jobWorker` service runs a continuous loop polling the `jobQueue` for pending jobs. When jobs are found, it executes them in isolated workspace contexts. The worker starts automatically with the server unless `--without-jobs` is specified.

## Examples

### Manual Control

```javascript
// Start manually
const loop = this.jobWorker.start();

// Stop gracefully
await this.jobWorker.stop();
```

### Process Queue Once

```javascript
// Process all pending jobs without starting the loop
await this.jobWorker.processQueue();
```

### Queue a Job for Immediate Processing

```javascript
// Push directly to queue
this.jobQueue.push('cleanup');

// Worker will pick it up on next poll (within 100ms)
```

## Command Line

```bash
npx pinstripe start-server              # With job worker (default)
npx pinstripe start-server --without-jobs  # Without job worker
npx pinstripe run-job --name cleanup  # Run manually
```

## Notes

- Worker polls queue every 100ms
- Each job runs in isolated workspace context
- Errors are logged but don't stop other jobs
- Works with `jobScheduler` for cron-based scheduling
