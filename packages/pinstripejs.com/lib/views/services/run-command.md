---
menu:
    path: ["Services", "runCommand"]
---
# runCommand

Execute CLI commands programmatically.

## Interface

```javascript
await this.runCommand(commandName, params)
```

### Parameters

- **commandName** - Dasherized command name (e.g., `'generate-migration'`)
- **params** - Object or array of parameters

### Returns

- Promise that resolves when command completes

## Description

The `runCommand` service executes CLI commands from within application code. Commands run in forked contexts, maintaining workspace isolation while sharing the current environment.

## Examples

### Basic Execution

```javascript
await this.runCommand('migrate-database');
await this.runCommand('list-commands');
```

### With Object Parameters

```javascript
await this.runCommand('generate-migration', {
    suffix: 'create_users',
    fields: 'name:string email:string',
    table: 'Users'
});
```

### With Array Parameters

```javascript
await this.runCommand('generate-service', ['--name', 'email-service']);
```

### Command Orchestration

```javascript
export default {
    async run() {
        await this.runCommand('drop-database');
        await this.runCommand('initialize-database');
        await this.runCommand('seed-database');
    }
}
```

### Error Handling

```javascript
try {
    await this.runCommand('migrate-database');
    console.log('Migration successful');
} catch (error) {
    console.error('Migration failed:', error.message);
}
```

### REPL Usage

```javascript
pinstripe > await runCommand('list-services')
pinstripe > await runCommand('generate-service', { name: 'notification' })
```

## Notes

- Commands run in forked (isolated) contexts
- Array params parsed like CLI arguments
- Dasherized flags convert to camelCase keys
- Used internally by CLI entry point
