---
menu:
    path: ["Services", "backgroundJobWorker"]
---
# backgroundJobWorker

Queue processor that executes background jobs.

## Interface

```javascript
this.backgroundJobWorker.start()         // Start worker loop
this.backgroundJobWorker.stop()          // Stop worker gracefully
this.backgroundJobWorker.destroy()       // Alias for stop()
this.backgroundJobWorker.processQueue()  // Process all pending jobs
```

## Description

The `backgroundJobWorker` service runs a continuous loop polling the `backgroundJobQueue` for pending jobs. When jobs are found, it executes them in isolated workspace contexts. The worker starts automatically with the server unless `--without-background-jobs` is specified.

## Examples

### Manual Control

```javascript
// Start manually
const loop = this.backgroundJobWorker.start();

// Stop gracefully
await this.backgroundJobWorker.stop();
```

### Process Queue Once

```javascript
// Process all pending jobs without starting the loop
await this.backgroundJobWorker.processQueue();
```

### Queue a Job for Immediate Processing

```javascript
// Push directly to queue
this.backgroundJobQueue.push('cleanup');

// Worker will pick it up on next poll (within 100ms)
```

## Command Line

```bash
npx pinstripe start-server              # With background job worker (default)
npx pinstripe start-server --without-background-jobs  # Without background job worker
npx pinstripe run-background-job --name cleanup  # Run manually
```

## Notes

- Worker polls queue every 100ms
- Each job runs in isolated workspace context
- Errors are logged but don't stop other jobs
- Works with `backgroundJobScheduler` for cron-based scheduling
