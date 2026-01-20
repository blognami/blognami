---
menu:
    path: ["Services", "jobQueue"]
---
# jobQueue

In-memory queue for pending jobs.

## Interface

```javascript
this.jobQueue.push(name, params)  // Add job to queue
this.jobQueue.shift()             // Remove and return next job
this.jobQueue.length              // Number of pending jobs (getter)
```

## Description

The `jobQueue` service provides a simple FIFO queue for jobs. The `jobScheduler` pushes jobs to this queue when their cron schedule matches, and the `jobWorker` shifts jobs from the queue to execute them.

## Examples

### Push a Job

```javascript
// Queue a job for immediate processing
this.jobQueue.push('cleanup');

// Queue with parameters
this.jobQueue.push('sendEmail', {
    to: 'user@example.com',
    subject: 'Welcome!'
});
```

Parameters are available in the job's `run()` method via `this.params`.

### Check Queue Length

```javascript
const pending = this.jobQueue.length;
console.log(`${pending} jobs waiting`);
```

### Manual Processing

```javascript
let job;
while (job = this.jobQueue.shift()) {
    await this.runJob(job.name, job.params);
}
```

## Notes

- Queue is in-memory only; jobs are lost on restart
- Jobs are stored as `{ name, params }` objects
- Singleton per context root

## Distributed Mode

When using `@pinstripe/distributed-jobs`, the leader node automatically moves jobs from the in-memory queue to the `distributedJobs` database table. This allows all worker nodes to claim and process jobs. See [jobCoordinator](/services/job-coordinator) for details.
