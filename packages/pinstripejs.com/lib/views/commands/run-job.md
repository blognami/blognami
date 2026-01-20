---
menu:
    path: ["Commands", "run-job"]
---
# run-job Command

## Interface

The command executes a job manually with the following signature:

```bash
pinstripe run-job <name>
```

### Parameters

- **`name`** (required) - The name of the job to execute (in snake_case)

### Examples

```bash
# Run a data cleanup job
pinstripe run-job cleanup_old_data

# Execute an email notification job
pinstripe run-job send_daily_reports

# Run a backup job
pinstripe run-job database_backup
```

## Description

The `run-job` command is a **manual execution tool** that runs jobs immediately outside of their scheduled cron timings. This command:

1. **Executes jobs on-demand** - Runs jobs immediately without waiting for scheduled execution
2. **Normalizes job names** - Converts input to snake_case format automatically
3. **Runs in isolated context** - Each execution runs in a fresh workspace context with proper cleanup
4. **Supports multi-tenant** - Automatically runs for each tenant when the job is multi-tenant enabled
5. **Provides error handling** - Job failures are properly isolated and reported

## Use Cases

### Development and Testing
- **Manual testing** - Test jobs during development
- **Debugging** - Execute jobs to diagnose issues
- **One-off execution** - Run maintenance tasks outside normal schedule

### Production Operations
- **Emergency execution** - Run critical jobs immediately when needed
- **Manual triggering** - Execute jobs based on external events
- **Recovery operations** - Re-run failed jobs manually

## Job Discovery

The command automatically discovers jobs from:
- `lib/jobs/` directory
- Registered jobs in the `Job` registry
- Multi-tenant and single-tenant job configurations

## Multi-Tenant Behavior

For multi-tenant jobs, the command:
- Automatically detects multi-tenant configuration
- Runs the job once for each active tenant
- Maintains proper tenant context isolation
- Supports custom tenant filtering when configured

## Related Commands

- **`list-jobs`** - List all available jobs in the project
- **`generate-job`** - Create new scheduled jobs
- **`start-server`** - Start the server with automatic job scheduling
