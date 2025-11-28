---
menus:
    sidebar: ["Services", "runInNewWorkspace"]
---
# runInNewWorkspace

Execute functions in isolated workspace contexts.

## Interface

```javascript
await this.runInNewWorkspace(fn)
```

### Parameters

- **fn** - Async function to execute (`this` refers to new workspace)

### Returns

- Promise resolving to function's return value

## Description

The `runInNewWorkspace` service creates completely isolated workspace contexts for function execution. Each workspace gets fresh service instances and database connections, making it ideal for background processing that shouldn't affect the current request.

## Examples

### Background Notifications

```javascript
export default {
    async success({ id }) {
        // Fire and forget - doesn't block response
        this.notifyUsers({ commentId: id });

        return this.renderRedirect({ target: '_top' });
    },

    async notifyUsers({ commentId }) {
        await this.runInNewWorkspace(async function() {
            const comment = await this.database.comments.where({ id: commentId }).first();
            if (!comment) return;

            const admins = await this.database.users.where({ role: 'admin' }).all();
            for (const admin of admins) {
                await admin.notify(({ line }) => line(`New comment: ${comment.body}`));
            }
        });
    }
}
```

### Non-Blocking Email

```javascript
export default {
    async signInUser(email) {
        // Send email in background
        this.runInNewWorkspace(async function() {
            await this.sendMail({
                to: email,
                subject: 'Welcome!',
                text: ({ line }) => line('Welcome to our platform!')
            });
        });

        // Return immediately
        return this.renderRedirect({ url: '/dashboard' });
    }
}
```

### Parallel Processing

```javascript
const results = await Promise.all(
    userIds.map(userId =>
        this.runInNewWorkspace(async function() {
            const user = await this.database.users.where({ id: userId }).first();
            await user.processData();
            return { userId, processed: true };
        })
    )
);
```

### Database Lock Isolation

```javascript
await Promise.all([
    this.database.lock(async () => { /* operation 1 */ }),

    // Separate workspace = separate connection = no lock conflict
    this.runInNewWorkspace(async function() {
        await this.database.lock(async () => { /* operation 2 */ });
    })
]);
```

## Notes

- Creates completely fresh workspace with new service instances
- Automatic cleanup when function completes
- Available on both server and client (`addToClient()`)
- Use for truly isolated operations only (has overhead)
- Variables from parent context not automatically available
