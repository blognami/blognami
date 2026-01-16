---
menu:
    path: ["Services", "backgroundJobQueue"]
---
# backgroundJobQueue

In-memory queue for pending background jobs.

## Interface

```javascript
await this.backgroundJobQueue.push(name, ...args)  // Add job to queue
await this.backgroundJobQueue.shift()              // Remove and return next job
await this.backgroundJobQueue.length()             // Number of pending jobs
```

## Description

The `backgroundJobQueue` service provides a simple FIFO queue for background jobs. The `backgroundJobScheduler` pushes jobs to this queue when their cron schedule matches, and the `backgroundJobWorker` shifts jobs from the queue to execute them.

## Examples

### Push a Job

```javascript
// Queue a job for immediate processing
await this.backgroundJobQueue.push('cleanup');

// Queue with arguments
await this.backgroundJobQueue.push('sendEmail', 'user@example.com', 'Welcome!');
```

### Check Queue Length

```javascript
const pending = await this.backgroundJobQueue.length();
console.log(`${pending} jobs waiting`);
```

### Manual Processing

```javascript
let job;
while (job = await this.backgroundJobQueue.shift()) {
    await this.runBackgroundJob(job.name, ...job.args);
}
```

## Notes

- Queue is in-memory only; jobs are lost on restart
- Jobs are stored as `{ name, args }` objects
- Singleton per context root
