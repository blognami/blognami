---
menus:
    sidebar: ["Commands", "run-background-job"]
---
# run-background-job Command

## Interface

The command executes a background job manually with the following signature:

```bash
pinstripe run-background-job <name>
```

### Parameters

- **`name`** (required) - The name of the background job to execute (in snake_case)

### Examples

```bash
# Run a data cleanup job
pinstripe run-background-job cleanup_old_data

# Execute an email notification job
pinstripe run-background-job send_daily_reports

# Run a backup job
pinstripe run-background-job database_backup
```

## Description

The `run-background-job` command is a **manual execution tool** that runs background jobs immediately outside of their scheduled cron timings. This command:

1. **Executes jobs on-demand** - Runs background jobs immediately without waiting for scheduled execution
2. **Normalizes job names** - Converts input to snake_case format automatically
3. **Runs in isolated context** - Each execution runs in a fresh workspace context with proper cleanup
4. **Supports multi-tenant** - Automatically runs for each tenant when the job is multi-tenant enabled
5. **Provides error handling** - Job failures are properly isolated and reported

## Use Cases

### Development and Testing
- **Manual testing** - Test background jobs during development
- **Debugging** - Execute jobs to diagnose issues
- **One-off execution** - Run maintenance tasks outside normal schedule

### Production Operations
- **Emergency execution** - Run critical jobs immediately when needed
- **Manual triggering** - Execute jobs based on external events
- **Recovery operations** - Re-run failed jobs manually

## Job Discovery

The command automatically discovers background jobs from:
- `lib/background_jobs/` directory
- Registered jobs in the `BackgroundJob` registry
- Multi-tenant and single-tenant job configurations

## Multi-Tenant Behavior

For multi-tenant jobs, the command:
- Automatically detects multi-tenant configuration
- Runs the job once for each active tenant
- Maintains proper tenant context isolation
- Supports custom tenant filtering when configured

## Related Commands

- **`list-background-jobs`** - List all available background jobs in the project
- **`generate-background-job`** - Create new scheduled background jobs
- **`start-server`** - Start the server with automatic background job scheduling