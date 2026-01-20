---
menu:
    path: ["Services", "jobQueue"]
---
# jobQueue

In-memory queue for pending jobs.

## Interface

```javascript
await this.jobQueue.push(name, ...args)  // Add job to queue
await this.jobQueue.shift()              // Remove and return next job
await this.jobQueue.length()             // Number of pending jobs
```

## Description

The `jobQueue` service provides a simple FIFO queue for jobs. The `jobScheduler` pushes jobs to this queue when their cron schedule matches, and the `jobWorker` shifts jobs from the queue to execute them.

## Examples

### Push a Job

```javascript
// Queue a job for immediate processing
await this.jobQueue.push('cleanup');

// Queue with arguments
await this.jobQueue.push('sendEmail', 'user@example.com', 'Welcome!');
```

### Check Queue Length

```javascript
const pending = await this.jobQueue.length();
console.log(`${pending} jobs waiting`);
```

### Manual Processing

```javascript
let job;
while (job = await this.jobQueue.shift()) {
    await this.runJob(job.name, ...job.args);
}
```

## Notes

- Queue is in-memory only; jobs are lost on restart
- Jobs are stored as `{ name, args }` objects
- Singleton per context root
