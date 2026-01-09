# Background Jobs Subsystem Reimplementation

## Overview

Reimplement the background jobs subsystem as a new `@pinstripe/background-jobs` package with distributed processing support, as specified in GitHub issue #112.

## Requirements (from issue #112)

1. Parameter handling for job configuration
2. Scheduled execution using cron-style timing patterns
3. Distributed processing across multiple server instances
4. Programmatic job queuing for immediate or delayed execution
5. Multi-tenant support for isolated job processing

## Architecture

**Leader-Follower Pattern**: One server instance acts as coordinator (scheduling cron jobs into the queue) while all instances participate as workers (claiming and executing jobs).

## Package Structure

```
packages/@pinstripe/background-jobs/
  package.json
  lib/
    index.js
    migrations/
      _file_importer.js
      1736400000_create_background_job_workers_table.js
      1736400001_create_background_jobs_table.js
    models/
      _file_importer.js
      background_job_worker.js
      background_job.js
    services/
      _file_importer.js
      background_job_coordinator.js
      background_job_worker.js
      queue_background_job.js
      bot.js  (override core bot service)
```

## Database Schema

### 1. `backgroundJobWorkers` - Worker registration

| Column | Type | Description |
|--------|------|-------------|
| instanceId | string (indexed) | UUID per server instance |
| hostname | string | Server hostname |
| pid | integer | Process ID |
| lastHeartbeatAt | datetime (indexed) | Last heartbeat timestamp |
| isLeader | boolean (indexed) | Whether this worker is the coordinator |
| status | string (indexed) | 'active', 'inactive', 'dead' |
| startedAt | datetime | When worker started |

### 2. `backgroundJobs` - Job queue

| Column | Type | Description |
|--------|------|-------------|
| jobName | string (indexed) | BackgroundJob registry name |
| params | text | JSON-serialized parameters |
| tenantId | foreign_key | For multi-tenant support |
| runAt | datetime (indexed) | Scheduled execution time |
| priority | integer (indexed) | Higher = run first (default 0) |
| status | string (indexed) | 'pending', 'processing' |
| backgroundJobWorkerId | foreign_key | Worker that claimed this job |
| claimedAt | datetime | When job was claimed |
| attempts | integer | Number of attempts (default 0) |
| maxAttempts | integer | Max retry attempts (default 3) |
| lastError | text | Last error message |
| source | string | 'cron' or 'programmatic' |

## Key Components

### 1. Worker Service (`background_job_worker.js`)

- Registers worker in database with heartbeat
- Polls for pending jobs every second
- Claims jobs atomically using `database.lock()`
- Executes jobs with proper tenant context
- Reports completion/failure with retry logic (exponential backoff)

### 2. Coordinator Service (`background_job_coordinator.js`)

- Leader election via database lock
- Cleans up dead workers (no heartbeat > 30s)
- Reclaims orphaned jobs from dead workers
- Schedules cron jobs into queue (respects multi-tenant flag)

### 3. Queue Service (`queue_background_job.js`)

Provides programmatic API:
```javascript
// Immediate execution
await this.queueBackgroundJob('send-email', { userId: 123 });

// Delayed execution
await this.queueBackgroundJob('send-email', { userId: 123 }, {
  runAt: new Date(Date.now() + 5 * 60 * 1000)  // 5 minutes
});

// High priority
await this.queueBackgroundJob('process-payment', { orderId: 456 }, {
  priority: 100
});
```

### 4. Bot Service Override

Replace core `bot` service to start worker + coordinator:
```javascript
async start(){
    await this.backgroundJobWorker.start();
    await this.backgroundJobCoordinator.start(this.backgroundJobWorker.instanceId);
}
```

## Distributed Coordination

### Leader Election
1. Workers check every 5s if active leader exists (heartbeat within 30s)
2. If no leader, compete using `database.lock()` to become leader
3. First to acquire lock and set `isLeader = true` wins
4. Leader schedules cron jobs; all workers process jobs

### Job Claiming
1. Worker acquires database lock
2. Finds oldest pending job where `runAt <= now`
3. Sets `status = 'processing'`, `backgroundJobWorkerId = workerId`
4. Releases lock, executes job
5. On success: deletes job from queue
6. On failure: retries with exponential backoff, or deletes after max attempts

### Failure Recovery
- **Worker crash during job**: Leader detects timeout, reclaims job
- **Leader crash**: Other workers detect no heartbeat, elect new leader
- **Stale jobs**: Coordinator reclaims jobs from dead workers

## Files to Modify

| File | Change |
|------|--------|
| `packages/pinstripe/lib/background_job.js` | Add params support to `run()` method |
| `packages/demo/package.json` | Add `@pinstripe/background-jobs` dependency |

## Backwards Compatibility

- Existing `schedule()` calls work unchanged
- Existing background job files work unchanged
- `multiTenant` and `tenantsFilter` flags still work
- `runBackgroundJob` service still available for direct execution

## Implementation Status

**All phases are COMPLETE.** All tests pass (102 E2E, 19 model, 8 service, 62 unit, 4 CLI tests).

### Phase 1: Package Foundation & Job Queue ✅ COMPLETE

### Phase 2: Single-Instance Job Processing ✅ COMPLETE

### Phase 3: Worker Registration & Distributed Claiming ✅ COMPLETE

### Phase 4: Leader Election & Cron Scheduling ✅ COMPLETE

## Remaining Work

### Remove old bot.js from core pinstripe

**File to delete:**
- `packages/pinstripe/lib/services/bot.js` - Old in-process cron scheduler (replaced by `@pinstripe/background-jobs`)

**Note:** Keep `run_background_job.js` for direct job execution (bypassing queue).

### Verification
- Run `npm run test` to ensure all tests pass after removal

## After That

The implementation will be ready to commit with:
- New package: `packages/@pinstripe/background-jobs/`
- Deleted: `packages/pinstripe/lib/services/bot.js`
- Modified: `packages/pinstripe/lib/background_job.js` (params support)
- Modified: `packages/demo/package.json` (added dependency)
- Modified: `packages/demo/lib/index.js` (added import)

