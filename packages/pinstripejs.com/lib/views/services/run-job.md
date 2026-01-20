---
menu:
    path: ["Services", "runJob"]
---
# runJob

Execute jobs manually.

## Interface

```javascript
await this.runJob(name, ...args)
```

### Parameters

- **name** - Job name
- **...args** - Optional arguments passed to job

### Returns

- Promise that resolves when job completes

## Description

The `runJob` service executes jobs immediately, bypassing their cron schedules. Useful for development, testing, and triggered execution. In multi-tenant environments, it automatically runs the job for each tenant.

## Examples

### Basic Execution

```javascript
await this.runJob('deliver-notifications');
```

### With Arguments

```javascript
await this.runJob('send-email', 'user@example.com', 'Welcome!');
```

### CLI Usage

```bash
npx pinstripe run-job --name deliver-notifications
```

### Error Handling

```javascript
export default {
    async render() {
        try {
            await this.runJob('risky-operation');
            return { status: 'success' };
        } catch (error) {
            console.error('Job failed:', error);
            return { status: 'error' };
        }
    }
}
```

### Multi-Tenant Job

```javascript
// Job with multi-tenant config
export default {
    meta() {
        this.schedule('0 * * * *');
        this.whereTenant({ active: true }); // only run for active tenants
    },

    async run() {
        // Runs once per matching tenant
        const users = await this.database.users.where({ subscribed: true }).all();
        for (let user of users) {
            await user.sendNewsletter();
        }
    }
};

// Execute - runs for all active tenants
await this.runJob('send-newsletter');
```

## Notes

- Each execution runs in isolated workspace context
- Multi-tenant jobs run once per matching tenant
- Errors propagate as promise rejections
- Used internally by the `jobWorker` service
