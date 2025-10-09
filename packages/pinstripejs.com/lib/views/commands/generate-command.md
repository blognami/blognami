---
sidebar:
    category: ["Commands", "generate-command"]
---
# generate-command Command

## Interface

The command creates a new CLI command file with the following signature:

```bash
pinstripe generate-command <name>
```

### Parameters

- **`name`** (required) - The name of the command to create (converted to snake_case)

### Examples

```bash
# Create a simple command
pinstripe generate-command my-task

# Create a command with multiple words
pinstripe generate-command send-email

# Create a command with camelCase (will be converted to snake_case)
pinstripe generate-command sendNotification
```

## Description

The `generate-command` command is a **CLI scaffolding tool** that creates new command files in your Pinstripe application. It automatically:

1. **Normalizes naming** - Converts the file name to snake_case format
2. **Creates command file** - Generates a new command in `lib/commands/` directory
3. **Sets up file importer** - Creates `_file_importer.js` if it doesn't exist
4. **Provides starter code** - Includes basic command structure with placeholder implementation

## Generated Files

```
lib/commands/
├── _file_importer.js     # Command base class import (created if needed)
└── command_name.js       # Your new command file
```

## Generated Command Structure

Each generated command includes:

```javascript
export default {
    run(){
        console.log('command-name command coming soon!')
    }
};
```

## Usage in Application

After generating a command, you can:

1. **Run the command** via CLI:
   ```bash
   pinstripe command-name
   ```

2. **Customize the implementation** by editing the `run()` method
3. **Add metadata** using the `meta()` method for parameters and descriptions
4. **Access Pinstripe features** like database, services, and utilities

## Command Development

### Adding Parameters
```javascript
export default {
    meta(){
        this.hasParam('email', { type: 'string', description: 'User email address' });
        this.hasParam('force', { type: 'boolean', description: 'Force operation' });
    },
    
    run(){
        const email = this.params.email;
        const force = this.params.force;
        // Implementation here
    }
};
```

### Using Services
```javascript
export default {
    run(){
        const userService = this.services.user;
        // Use services here
    }
};
```

## Related Commands

- **`list-commands`** - List all available commands in the project
- **`generate-service`** - Generate business logic services
- **`generate-background-job`** - Generate scheduled tasks