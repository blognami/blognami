---
menu:
    path: ["Services", "jobCoordinator"]
---
# jobCoordinator

Orchestrates job scheduling and processing.

## Interface

```javascript
this.jobCoordinator.start()    // Start scheduler and worker
this.jobCoordinator.stop()     // Stop all job processing
this.jobCoordinator.destroy()  // Alias for stop()
```

## Description

The `jobCoordinator` service manages both the `jobScheduler` and `jobWorker` services. It starts automatically with the server unless `--without-jobs` is specified. In single-server mode, it simply starts both services. In distributed mode, it handles leader election and job distribution across multiple servers.

## Examples

### Server Startup

```javascript
// In start-server command (automatic)
if (!withoutJobs) {
    this.jobCoordinator.start();
}
```

### Manual Control

```javascript
// Start manually
this.jobCoordinator.start();

// Stop gracefully
await this.jobCoordinator.stop();
```

## Command Line

```bash
npx pinstripe start-server                 # With job coordinator (default)
npx pinstripe start-server --without-jobs  # Without job processing
```

## Distributed Mode

For multi-server deployments, use the `@pinstripe/distributed-jobs` package.

### Installation

```bash
npm install @pinstripe/distributed-jobs
```

### Activation

Import the package in your app's entry point:

```javascript
// lib/index.js
import '@pinstripe/distributed-jobs';
```

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    Database                             │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │ leadJobCoordinators │  │    distributedJobs      │   │
│  │ (leader election)   │  │    (shared queue)       │   │
│  └─────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
           ▲                          ▲
           │                          │
    ┌──────┴──────┐           ┌───────┴───────┐
    │   Leader    │           │   Workers     │
    │  (Server A) │           │  (All Nodes)  │
    │             │           │               │
    │ - Scheduler │──jobs────►│ - Claim jobs  │
    │ - Heartbeat │           │ - Execute     │
    └─────────────┘           └───────────────┘
```

**Leader Election:**
- One server becomes the leader and runs the scheduler
- Leader sends heartbeat every 5 seconds
- If heartbeat timeout (15 seconds) exceeded, another server takes over

**Job Distribution:**
- Leader pushes scheduled jobs to `distributedJobs` table
- All workers (including leader) claim and execute jobs from the database
- Jobs are claimed atomically via database locks

### Database Tables

The package creates two tables via migration:

- `leadJobCoordinators` - Stores current leader ID and last heartbeat timestamp
- `distributedJobs` - Shared job queue with name, params (JSON), and createdAt

### Configuration

No additional configuration needed. The distributed coordinator automatically replaces the default single-server coordinator when the package is imported.

## Notes

- Single server: coordinator simply delegates to scheduler and worker
- Multi-server: coordinator handles leader election and job distribution
- Graceful shutdown releases leadership and stops all services
