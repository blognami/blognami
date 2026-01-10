---
menu:
    path: ["Commands", "queue-background-job"]
---
# queue-background-job Command

## Interface

The command queues a background job for asynchronous processing:

```bash
pinstripe queue-background-job <name>
```

### Parameters

- **`name`** (required) - The name of the background job to queue (in snake_case)

### Examples

```bash
# Queue a data cleanup job
pinstripe queue-background-job cleanup_old_data

# Queue an email notification job
pinstripe queue-background-job send_daily_reports

# Queue a backup job
pinstripe queue-background-job database_backup
```

## Description

The `queue-background-job` command adds a background job to the processing queue for asynchronous execution by the distributed worker system. This command:

1. **Queues jobs for processing** - Adds jobs to the database queue for worker pickup
2. **Normalizes job names** - Converts input to dasherized format automatically
3. **Distributed execution** - Jobs are processed by available background job workers
4. **Supports retries** - Failed jobs are automatically retried with exponential backoff

## Use Cases

### Development and Testing
- **Manual testing** - Queue background jobs during development
- **Debugging** - Queue jobs to diagnose issues
- **One-off execution** - Queue maintenance tasks outside normal schedule

### Production Operations
- **Emergency execution** - Queue critical jobs for immediate processing
- **Manual triggering** - Queue jobs based on external events
- **Recovery operations** - Re-queue failed jobs manually

## Job Discovery

The command automatically discovers background jobs from:
- `lib/background_jobs/` directory
- Registered jobs in the `BackgroundJob` registry

## Related Commands

- **`list-background-jobs`** - List all available background jobs in the project
- **`generate-background-job`** - Create new scheduled background jobs
- **`start-server`** - Start the server with automatic background job scheduling
