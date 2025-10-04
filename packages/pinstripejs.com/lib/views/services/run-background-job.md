---
sidebar:
    category: ["Services", "runBackgroundJob"]
---
# runBackgroundJob Service

## Interface

The service creates a function that executes background jobs by name:

```javascript
await this.runBackgroundJob(name, ...args)
```

### Parameters

- **`name`** - (string) The name of the background job to execute
- **`...args`** - (optional) Additional arguments passed to the background job

### Return Values

- Returns a `Promise` that resolves when the background job execution completes
- The promise resolves to `undefined` on successful completion
- Throws errors if the background job fails or doesn't exist

## Description

The `runBackgroundJob` service provides **manual execution of background jobs** outside of their scheduled cron timings. It:

1. **Executes jobs immediately** without waiting for their scheduled time
2. **Runs in isolated workspace contexts** ensuring proper resource management and cleanup
3. **Supports multi-tenant environments** by running jobs for each tenant when configured
4. **Handles job discovery** through the `BackgroundJob` class registry
5. **Passes through arguments** to support parameterized job execution
6. **Provides error isolation** so job failures don't affect the calling context

The service is particularly useful for:
- **Manual job execution** during development and testing
- **Interactive job testing** in the REPL environment  
- **CLI-based job execution** through command line tools
- **Triggered job execution** from application logic
- **Multi-tenant job coordination** when tenant-specific processing is needed

## Key Features

### Single Job Execution
- Executes one specific background job by name
- Jobs run immediately when called, not on schedule
- Each execution runs in a fresh workspace context

### Multi-Tenant Support
- Automatically detects if a job is multi-tenant enabled
- Runs the job once for each active tenant
- Preserves tenant context through `initialParams` headers
- Supports custom tenant filtering via `tenantsFilter` property

### Argument Passing  
- Supports passing additional arguments to background jobs
- Arguments are forwarded directly to the job's `run()` method
- Useful for parameterized or dynamic job execution

### Error Handling
- Job failures are properly isolated from the calling context
- Errors bubble up as promise rejections
- Individual tenant job failures don't affect other tenants

## Examples

### Basic Job Execution

```javascript
// Execute a background job immediately
await this.runBackgroundJob('deliver-notifications');

// Execute with arguments
await this.runBackgroundJob('send-email', 'user@example.com', 'Welcome!');
```

### Command Line Usage

```bash
# Run a background job manually via CLI
pinstripe run-background-job --name deliver-notifications

# List available background jobs
pinstripe list-background-jobs
```

### REPL Interactive Execution

```javascript
// In the Pinstripe REPL
pinstripe > await runBackgroundJob('send-newsletter')
Newsletter job completed successfully

pinstripe > await runBackgroundJob('maintenance')
Maintenance job executed
```

### Multi-Tenant Job Execution

```javascript
// Background job with multi-tenant configuration
export default {
    meta(){
        this.schedule('0 * * * *'); // Hourly
    },
    
    // Enable multi-tenant execution
    multiTenant: true,
    
    // Optional: Filter which tenants to run for
    tenantsFilter: tenants => tenants.where({ active: true }),
    
    async run(){
        // This runs once per tenant when called via runBackgroundJob
        const users = await this.database.users.where({ 
            subscribed: true 
        }).all();
        
        for(let user of users){
            await user.sendNewsletter();
        }
    }
};

// Execute - will automatically run for all active tenants
await this.runBackgroundJob('send-newsletter');
```

### Development and Testing

```javascript
// Test job execution during development
export default {
    async render(){
        // Trigger background job based on user action
        if(this.params.processNotifications){
            await this.runBackgroundJob('deliver-notifications');
        }
        
        return { message: 'Processing complete' };
    }
}
```

### Error Handling

```javascript
// Handle job execution errors
export default {
    async render(){
        try {
            await this.runBackgroundJob('risky-operation');
            return { status: 'success' };
        } catch(error) {
            console.error('Background job failed:', error);
            return { status: 'error', message: error.message };
        }
    }
}
```

### Bot Service Integration

```javascript
// The bot service uses runBackgroundJob internally
export default {
    async runBackgroundJobs(unixTime){
        // Bot discovers and executes scheduled jobs
        for(let backgroundJob of discoveredJobs){
            if(shouldRunAtTime(backgroundJob, unixTime)){
                await Workspace.run(async function(){
                    // Uses runBackgroundJob under the hood
                    await this.runBackgroundJob(backgroundJob.name, ...args);
                });
            }
        }
    }
}
```

## Background Job Structure

Background jobs executed by this service follow a standard pattern:

```javascript
export default {
    meta(){
        // Cron schedule (used by bot service)
        this.schedule('*/5 * * * *'); // Every 5 minutes
        
        // Multiple schedules supported
        this.schedule('0 0 * * *'); // Daily at midnight
        this.schedule('0 12 * * 1'); // Weekly on Monday at noon
    },
    
    // Multi-tenant configuration
    multiTenant: true,
    tenantsFilter: tenants => tenants.where({ active: true }),
    
    // Custom properties
    batchSize: 100,
    retryCount: 3,
    
    async run(){
        // Job implementation with access to services
        const records = await this.database.notifications
            .where({ sent: false })
            .limit(this.batchSize)
            .all();
            
        for(let record of records){
            await record.send();
            await record.update({ sent: true });
        }
    }
};
```

## Implementation Details

### Base Implementation
```javascript
// packages/pinstripe/lib/services/run_background_job.js
export default {
    create(){
        return name => BackgroundJob.run(this.context, name);
    }
};
```

### Multi-Tenant Implementation
```javascript
// packages/@pinstripe/multi-tenant/lib/services/run_background_job.js
export default {
    create(){
        return name => this.runBackgroundJob(name);
    },

    async runBackgroundJob(name){
        const { multiTenant = true, tenantsFilter = tenants => tenants } = BackgroundJob.for(name);

        if(multiTenant){
            // Run for each tenant
            for(let tenant of await tenantsFilter(this.database.tenants).all()){
                await Workspace.run(async function(){
                    this.initialParams._headers['x-tenant-id'] = tenant.id;
                    await BackgroundJob.run(this.context, name);
                });
            }
        } else {
            // Single execution
            await BackgroundJob.run(this.context, name);
        }
    }
};
```

## Related Services

- **`bot`** - Automated scheduler that uses `runBackgroundJob` internally
- **`database`** - Provides data access within background jobs
- **`initialParams`** - Maintains context and tenant information
- **`repl`** - Interactive environment for manual job execution

## Command Line Tools

- **`pinstripe run-background-job --name <job-name>`** - Execute a job manually
- **`pinstripe list-background-jobs`** - List all available background jobs
- **`pinstripe generate-background-job --name <job-name>`** - Create a new background job

## Performance Considerations

### Context Isolation
- Each job execution runs in a fresh workspace context
- Contexts are properly cleaned up after execution
- No state bleeding between job executions

### Multi-Tenant Overhead
- Multi-tenant jobs create separate contexts for each tenant
- Consider tenant filtering for large tenant counts
- Database connections are managed per context

### Error Isolation
- Individual job failures don't affect other jobs or calling code
- Tenant-specific failures don't stop other tenants from executing
- Proper error logging and propagation

## Testing and Development

### Manual Testing
```javascript
// Test jobs in development environment
await this.runBackgroundJob('test-job');
```

### REPL Testing
```bash
# Start REPL and test interactively
pinstripe repl
> await runBackgroundJob('my-job')
```

### CLI Testing
```bash
# Test without starting the bot scheduler
pinstripe run-background-job --name my-job
```