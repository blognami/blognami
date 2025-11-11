---
menus:
    sidebar: ["Services", "runCommand"]
---
# runCommand Service

The `runCommand` service provides programmatic execution of Pinstripe CLI commands from within the application context. It allows services, views, commands, and background jobs to execute other commands as if they were run from the command line, while maintaining proper workspace isolation and context passing.

## Interface

```javascript
this.runCommand(commandName, params = {})
```

### Parameters

#### `commandName` (string, required)
The name of the command to execute, using the dasherized format (e.g., `'generate-migration'`, `'reset-database'`).

#### `params` (object or array, optional)
Parameters to pass to the command. Can be:
- **Object**: Key-value pairs representing command parameters
- **Array**: Command line arguments that will be parsed into parameters
- **Default**: `{}` (empty object)

### Return Value

Returns a `Promise` that resolves when the command execution completes. The service does not return the command's output - commands typically log to console or perform side effects.

## Description

The `runCommand` service provides **programmatic command execution** within the Pinstripe application context. It:

1. **Executes commands programmatically** without needing to spawn shell processes
2. **Maintains workspace isolation** by running commands in forked contexts
3. **Handles parameter normalization** supporting both object and array parameter formats
4. **Preserves context state** ensuring commands have access to the current workspace
5. **Enables command composition** allowing commands to orchestrate other commands
6. **Supports both CLI and service contexts** working in commands, views, services, and background jobs

The service is particularly useful for:
- **Command orchestration** where one command needs to execute multiple sub-commands
- **Database operations** like initialization sequences that require multiple steps
- **Code generation workflows** where generating one resource triggers generating related resources
- **Testing scenarios** where programmatic command execution is needed
- **Interactive development** through the REPL for manual command execution

## Examples

### Basic Command Execution

```javascript
// Execute a simple command with no parameters
await this.runCommand('list-commands');

// Execute a command that performs database operations
await this.runCommand('migrate-database');
```

### Command with Object Parameters

```javascript
// Generate a migration with specific parameters
await this.runCommand('generate-migration', {
    suffix: 'create_users',
    fields: 'name:string email:string',
    table: 'Users'
});

// Generate a model with parameters
await this.runCommand('generate-model', {
    name: 'user',
    fields: 'name:string email:string'
});
```

### Command with Array Parameters (CLI-style)

```javascript
// Pass parameters as command line arguments
await this.runCommand('generate-service', ['--name', 'email-service']);

// Multiple parameters as array
await this.runCommand('generate-view', ['--name', 'admin/users', '--layout', 'admin']);
```

### Command Composition and Orchestration

```javascript
// Database initialization sequence
export default {
    async run(){
        await this.runCommand('drop-database');
        await this.runCommand('initialize-database');
    }
};
```

```javascript
// Model generation that triggers migration creation
export default {
    async run(){
        const name = this.inflector.snakeify(this.params.name || '');
        const collectionName = this.inflector.camelize(this.inflector.pluralize(name));
        
        // Generate migration if table doesn't exist
        if(!await this.database[collectionName]){
            await this.runCommand('generate-migration', { 
                suffix: `create_${name}`, 
                fields: this.params.fields,
                table: collectionName
            });
        }
        
        // Generate the model file
        await this.generateModelFile(name);
    }
};
```

### Database Operations

```javascript
// Complete database reset and initialization
export default {
    async run(){
        await this.runCommand('reset-database');
        console.log('Database reset complete');
    }
};
```

```javascript
// Initialize database with migrations and seeding
export default {
    async run(){
        await this.runCommand('migrate-database');
        await this.runCommand('seed-database');
        console.log('Database initialization complete');
    }
};
```

### View Integration

```javascript
// Execute command from a view (e.g., admin interface)
export default {
    async render(){
        // Reset test database from SQL dump
        await this.database.destroy();
        await this.runCommand('reset-database-from-sql');
        
        return [200, {'content-type': 'text/json'}, [JSON.stringify({})]];
    }
};
```

### CLI Integration

```javascript
// Main CLI entry point using runCommand
export default async function(){
    const [name, ...args] = process.argv.slice(2);
    
    await Workspace.run(async function(){
        await this.runCommand(name, args);
    });
};
```

### Testing Integration

```javascript
// Test helpers that reset state between tests
import { Workspace } from 'pinstripe';

export const reset = async () => Workspace.run(async function(){
    await this.runCommand('reset-database');
});
```

### REPL Interactive Usage

```javascript
// In the Pinstripe REPL
pinstripe > await runCommand('list-services')
// Lists all available services

pinstripe > await runCommand('generate-service', { name: 'notification' })
// Generates a new service interactively

pinstripe > await runCommand('migrate-database')
// Runs database migrations
```

### Error Handling

```javascript
export default {
    async run(){
        try {
            await this.runCommand('migrate-database');
            console.log('Migration successful');
        } catch(error) {
            console.error('Migration failed:', error.message);
            // Command execution failed - handle appropriately
        }
    }
};
```

### Multi-Step Workflows

```javascript
// Complex deployment workflow
export default {
    async run(){
        const { environment } = this.params;
        
        console.log(`Deploying to ${environment}...`);
        
        // Run pre-deployment commands
        await this.runCommand('run-background-job', { name: 'pre-deploy-cleanup' });
        
        // Update database schema
        await this.runCommand('migrate-database');
        
        // Seed any new reference data
        await this.runCommand('seed-database');
        
        // Run post-deployment verification
        await this.runCommand('run-background-job', { name: 'deployment-verification' });
        
        console.log('Deployment complete!');
    }
};
```

## Parameter Handling

### Object Parameters
When passing an object, keys are used directly as parameter names:

```javascript
await this.runCommand('generate-migration', {
    suffix: 'add_email_to_users',
    fields: 'email:string',
    table: 'Users'
});
// Equivalent to: pinstripe generate-migration --suffix add_email_to_users --fields email:string --table Users
```

### Array Parameters
When passing an array, it's parsed as command line arguments:

```javascript
await this.runCommand('generate-service', ['--name', 'user-service', '--description', 'Handles user operations']);
// Equivalent to: pinstripe generate-service --name user-service --description "Handles user operations"
```

### Parameter Normalization
- Array parameters are parsed using the same logic as CLI argument parsing
- Dasherized command line flags are converted to camelCase object keys
- Boolean flags are handled appropriately (presence = true)

## Implementation Details

The service is implemented as a thin wrapper around the `Command.run()` method:

```javascript
// packages/pinstripe/lib/services/run_command.js
import { Command } from '../command.js';

export default {
    create(){
        return (...args) => Command.run(this.context, ...args);
    }
};
```

The underlying `Command.run()` method:
1. **Creates a forked context** to isolate command execution
2. **Normalizes parameters** from arrays or objects into the expected format
3. **Instantiates the command** with the current context
4. **Executes the command's run method** within the isolated context

## Use Cases

### Development Workflows
- **Code generation**: Commands that generate multiple related files
- **Database management**: Orchestrating complex database operations
- **Testing setup**: Programmatically preparing test environments

### Administrative Tasks
- **Deployment scripts**: Multi-step deployment processes
- **Maintenance operations**: Scheduled maintenance that requires multiple commands
- **Data migration**: Complex data transformation workflows

### Interactive Development
- **REPL usage**: Manual command execution during development
- **Admin interfaces**: Web-based administrative tools that execute commands
- **Development tools**: Custom development utilities that orchestrate existing commands

## Related Services

- **`repl`** - Interactive environment where `runCommand` is available globally
- **`runBackgroundJob`** - Similar service for executing background jobs
- **`fsBuilder`** - File system operations often used within generated commands
- **`database`** - Database operations frequently orchestrated through commands

## Command Line Integration

All Pinstripe CLI commands are executed through this service internally:

```bash
# These CLI commands use runCommand internally:
pinstripe generate-model --name user
pinstripe migrate-database  
pinstripe reset-database
pinstripe list-commands
```

The main CLI entry point (`cli.js`) uses `runCommand` to execute the requested command within a workspace context.

## Best Practices

### Error Handling
Always wrap command execution in try-catch blocks when command failure needs to be handled gracefully:

```javascript
try {
    await this.runCommand('migrate-database');
} catch(error) {
    console.error('Migration failed:', error.message);
    // Handle failure appropriately
}
```

### Parameter Validation  
Validate required parameters before executing commands:

```javascript
const { name } = this.params;
if(!name) {
    console.error('--name parameter is required');
    return;
}
await this.runCommand('generate-service', { name });
```

### Context Awareness
Remember that commands execute in forked contexts - they inherit the current workspace state but changes don't affect the calling context.

### Logging and Feedback
Commands typically handle their own logging, but provide additional context when orchestrating multiple commands:

```javascript
console.log('Starting database initialization...');
await this.runCommand('initialize-database');
console.log('Database initialization complete');
```