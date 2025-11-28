---
menus:
    sidebar: ["Services", "runBackgroundJob"]
---
# runBackgroundJob

Execute background jobs manually.

## Interface

```javascript
await this.runBackgroundJob(name, ...args)
```

### Parameters

- **name** - Background job name
- **...args** - Optional arguments passed to job

### Returns

- Promise that resolves when job completes

## Description

The `runBackgroundJob` service executes background jobs immediately, bypassing their cron schedules. Useful for development, testing, and triggered execution. In multi-tenant environments, it automatically runs the job for each tenant.

## Examples

### Basic Execution

```javascript
await this.runBackgroundJob('deliver-notifications');
```

### With Arguments

```javascript
await this.runBackgroundJob('send-email', 'user@example.com', 'Welcome!');
```

### CLI Usage

```bash
npx pinstripe run-background-job --name deliver-notifications
```

### Error Handling

```javascript
export default {
    async render() {
        try {
            await this.runBackgroundJob('risky-operation');
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
// Background job with multi-tenant config
export default {
    meta() {
        this.schedule('0 * * * *');
    },

    multiTenant: true,
    tenantsFilter: tenants => tenants.where({ active: true }),

    async run() {
        // Runs once per tenant
        const users = await this.database.users.where({ subscribed: true }).all();
        for (let user of users) {
            await user.sendNewsletter();
        }
    }
};

// Execute - runs for all active tenants
await this.runBackgroundJob('send-newsletter');
```

## Notes

- Each execution runs in isolated workspace context
- Multi-tenant jobs run once per matching tenant
- Errors propagate as promise rejections
- Used internally by the `bot` scheduler service
