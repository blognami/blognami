---
menus:
    sidebar: ["Services", "bot"]
---
# bot Service

## Interface

The service creates an object with lifecycle and background job management methods:

```javascript
this.bot.start()
this.bot.stop()
this.bot.destroy()
this.bot.runBackgroundJobs(unixTime)
```

### Methods

- **`start()`** - Starts the background job scheduler loop
- **`stop()`** - Stops the background job scheduler and waits for completion
- **`destroy()`** - Alias for `stop()` method  
- **`runBackgroundJobs(unixTime)`** - Executes scheduled background jobs for a specific unix timestamp

### Return Values

- **`start()`** returns a `Promise` that resolves when the scheduler loop completes
- **`stop()`** returns a `Promise` that resolves when the scheduler has fully stopped
- **`destroy()`** returns a `Promise` that resolves when cleanup is complete
- **`runBackgroundJobs()`** returns a `Promise` that resolves when all scheduled jobs for the timestamp complete

## Description

The `bot` service is a **cron-based background job scheduler** that:

1. **Runs continuously in a loop** checking for scheduled jobs every second
2. **Executes background jobs** based on cron expressions defined in background job classes
3. **Manages job scheduling** using unix timestamps for precise timing control
4. **Handles errors gracefully** with try-catch blocks around job execution
5. **Supports job arguments** passed through the schedule definition
6. **Runs in isolated contexts** using `Workspace.run()` for each job execution
7. **Can be disabled** via the `--without-bot` flag when starting the server

The bot automatically discovers all registered background jobs through `BackgroundJob.names` and executes them according to their cron schedules. Each job runs in its own workspace context to ensure isolation and proper resource management.

## Key Features

### Cron-based Scheduling
- Uses standard cron expression syntax for job timing
- Supports multiple schedules per background job
- Evaluates schedules every second for precise execution

### Error Handling  
- Catches and logs errors from individual job execution
- Continues running other jobs even if one fails
- Provides console error output for debugging

### Resource Management
- Each job executes in a forked workspace context
- Automatic cleanup through context lifecycle management
- Proper promise handling and async execution

### Integration with Server
- Automatically starts when server starts (unless `--without-bot` flag is used)
- Can be stopped independently of the server
- Integrates with the Pinstripe command system

## Examples

### Basic Usage (Automatic Start)

```javascript
// The bot starts automatically when the server starts
// via the start-server command
await this.runCommand('start-server');
// Bot is now running and processing background jobs
```

### Manual Bot Control

```javascript
// Start the bot manually
const botLoop = this.bot.start();

// Run some operations while bot is active
await someOperations();

// Stop the bot gracefully
await this.bot.stop();

// Or use destroy (alias for stop)
await this.bot.destroy();
```

### Starting Server Without Bot

```bash
# Disable the bot when starting the server
pinstripe start-server --without-bot
```

### Manual Background Job Execution

```javascript
// Execute background jobs for a specific unix timestamp
const unixTime = Math.floor(Date.now() / 1000);
await this.bot.runBackgroundJobs(unixTime);
```

### Creating Background Jobs for the Bot

```javascript
// Define a background job that the bot will execute
export default {
    meta(){
        // Run every 5 minutes
        this.schedule('*/5 * * * *');
        
        // Multiple schedules supported
        this.schedule('0 0 * * *'); // Daily at midnight
        this.schedule('0 12 * * 1'); // Weekly on Monday at noon
        
        // With arguments
        this.schedule('0 * * * *', 'hourly-cleanup', { deep: true });
    },

    async run(){
        // Job logic here
        console.log('Background job executed!');
        
        // Access services and models
        await this.database.users.where({ inactive: true }).delete();
    }
};
```

### Bot with Multi-Tenant Support

```javascript
// In multi-tenant environments, background jobs can run per tenant
export default {
    meta(){
        this.schedule('*/10 * * * *');
    },
    
    // Multi-tenant configuration
    multiTenant: true,
    
    // Optional tenant filtering
    tenantsFilter: tenants => tenants.where({ active: true }),
    
    async run(){
        // This runs once per tenant
        const currentTenant = this.initialParams._headers['x-tenant-id'];
        await this.processTenantSpecificTasks();
    }
};
```

## Background Job Integration

The bot service works closely with the `BackgroundJob` class system:

### Job Discovery
```javascript
// Bot automatically discovers all registered background jobs
const backgroundJobs = BackgroundJob.names.map(name => BackgroundJob.for(name));
```

### Schedule Processing
```javascript
// Each job can have multiple cron schedules
const schedules = [...backgroundJob.schedules];
// Format: [crontab, ...args]
```

### Job Execution
```javascript
// Jobs run in isolated workspace contexts
await Workspace.run(async function(){
    await this.runBackgroundJob(backgroundJob.name, ...args);
});
```

## Command Line Integration

### Available Commands

```bash
# Generate a new background job
pinstripe generate-background-job --name my-cleanup-task

# List all available background jobs  
pinstripe list-background-jobs

# Run a background job manually
pinstripe run-background-job --name my-cleanup-task

# Start server with bot (default)
pinstripe start-server

# Start server without bot
pinstripe start-server --without-bot
```

### Generated Background Job Template

```javascript
export default {
    meta(){
        this.schedule('* * * * *'); // run every minute
    },

    run(){
        console.log('my-cleanup-task background job coming soon!')
    }
};
```

## Cron Expression Reference

The bot uses standard cron syntax:

```
┌───────────── minute (0 - 59)
│ ┌─────────── hour (0 - 23)  
│ │ ┌───────── day of month (1 - 31)
│ │ │ ┌─────── month (1 - 12)
│ │ │ │ ┌───── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

### Common Patterns

```javascript
// Every minute
this.schedule('* * * * *');

// Every 5 minutes  
this.schedule('*/5 * * * *');

// Daily at 2:30 AM
this.schedule('30 2 * * *');

// Every Monday at 9 AM
this.schedule('0 9 * * 1');

// First day of every month at midnight
this.schedule('0 0 1 * *');
```

## Performance Considerations

### Timing Precision
- Bot checks for jobs every second using unix timestamps
- Jobs scheduled for the same second will execute sequentially
- Large numbers of concurrent jobs may cause delays

### Memory Usage
- Each job runs in a forked context that gets cleaned up
- Job instances are created fresh for each execution
- Background job discovery happens once per second

### Error Isolation
- Individual job failures don't affect other jobs
- Errors are logged but don't stop the bot loop
- Failed jobs will retry on their next scheduled time

## Common Use Cases

### Data Maintenance
```javascript
// Clean up expired sessions
export default {
    meta(){ this.schedule('*/5 * * * *'); },
    async run(){
        await this.database.sessions.where({
            lastAccessedAtLt: new Date(Date.now() - (1000 * 60 * 30))
        }).delete();
    }
};
```

### Notification Delivery
```javascript
// Process pending notifications
export default {
    meta(){ this.schedule('*/2 * * * *'); },
    async run(){
        for (let user of await this.database.users.where({ 
            readyToDeliverNotifications: true 
        }).all()){
            await user.deliverNotifications();
        }
    }
};
```

### Data Cleanup
```javascript
// Remove expired tokens
export default {
    meta(){ this.schedule('*/5 * * * *'); },
    async run(){
        await this.database.usedHashes.where({
            expiresAtLt: new Date()
        }).delete();
    }
};
```

### Scheduled Reports
```javascript
// Generate daily reports
export default {
    meta(){ this.schedule('0 6 * * *'); }, // 6 AM daily
    async run(){
        const report = await this.generateDailyReport();
        await this.sendReportEmail(report);
    }
};
```

## Testing and Development

### Testing Without Bot
```bash
# Run tests without background job interference
npm run test:e2e -- --without-bot
```

### Development Environment
```javascript
// In development, consider less frequent schedules
export default {
    meta(){
        const isDev = process.env.NODE_ENV === 'development';
        // Every 5 minutes in dev, every minute in production
        this.schedule(isDev ? '*/5 * * * *' : '* * * * *');
    },
    
    async run(){
        // Job logic
    }
};
```

### Manual Job Testing
```javascript
// Test background jobs manually without waiting for schedule
await this.runBackgroundJob('my-job-name');
```

## Integration Patterns

### With Database Models
```javascript
export default {
    meta(){ this.schedule('0 2 * * *'); }, // Daily at 2 AM
    
    async run(){
        // Use model methods and relationships
        const users = await this.database.users
            .where({ lastLoginLt: thirtyDaysAgo() })
            .include('subscriptions');
            
        for(let user of users){
            await user.sendInactivityEmail();
        }
    }
};
```

### With External APIs
```javascript
export default {
    meta(){ this.schedule('0 */6 * * *'); }, // Every 6 hours
    
    async run(){
        // Sync with external service
        const updates = await fetch('https://api.example.com/updates');
        const data = await updates.json();
        
        for(let item of data.items){
            await this.database.externalData.upsert(item);
        }
    }
};
```

### Error Handling Best Practices
```javascript
export default {
    meta(){ this.schedule('*/10 * * * *'); },
    
    async run(){
        try {
            await this.performCriticalTask();
        } catch(error) {
            // Log specific error details
            console.error(`Critical task failed: ${error.message}`);
            
            // Optionally notify administrators
            await this.sendErrorNotification(error);
            
            // Don't re-throw - let other jobs continue
        }
    }
};
```