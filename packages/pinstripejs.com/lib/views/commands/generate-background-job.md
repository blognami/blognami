---
sidebar:
    category: ["Commands", "generate-background-job"]
---
# generate-background-job Command

## Interface

The command creates a new background job with the following signature:

```bash
pinstripe generate-background-job <name>
```

### Parameters

- **`name`** (required) - The name of the background job to create (in snake_case)

### Examples

```bash
# Create a data cleanup job
pinstripe generate-background-job cleanup_old_data

# Create an email notification job
pinstripe generate-background-job send_daily_reports

# Create a backup job
pinstripe generate-background-job database_backup
```

## Description

The `generate-background-job` command is a **code generation tool** that creates scheduled background jobs for your Pinstripe application. This command:

1. **Creates job file** - Generates a new background job file in `lib/background_jobs/`
2. **Sets up scheduling** - Includes cron-style schedule configuration (defaults to every minute)
3. **Provides template** - Creates boilerplate code with meta() and run() methods
4. **Ensures directory structure** - Creates the background_jobs directory and file importer if needed

## Generated File Structure

```
lib/background_jobs/
├── _file_importer.js     # Auto-generated importer (created once)
└── job_name.js           # Your new background job
```

## Generated Code Template

```javascript
export default {
    meta(){
        this.schedule('* * * * *'); // run every minute
    },

    run(){
        console.log('job-name background job coming soon!')
    }
};
```

## Key Features

### Cron Scheduling
- **Default schedule**: `* * * * *` (every minute)
- **Customizable**: Modify the cron expression in the `meta()` method
- **Standard format**: Uses standard cron syntax (minute, hour, day, month, weekday)

### Naming Convention
- **Input normalization**: Converts input to snake_case automatically
- **File naming**: Creates files with snake_case names
- **Console output**: Uses dasherized names in generated console.log statements

### Directory Management
- **Auto-creation**: Creates `lib/background_jobs/` directory if it doesn't exist
- **File importer**: Generates `_file_importer.js` once to enable job discovery
- **Skip existing**: Won't overwrite existing file importer

## Common Schedule Patterns

```javascript
// Every minute
this.schedule('* * * * *');

// Every hour at minute 0
this.schedule('0 * * * *');

// Daily at 3:30 AM
this.schedule('30 3 * * *');

// Weekly on Monday at 2:00 AM
this.schedule('0 2 * * 1');

// Monthly on the 1st at midnight
this.schedule('0 0 1 * *');
```

## Related Commands

- **`list-background-jobs`** - List all available background jobs in the project
- **`run-background-job`** - Execute a specific background job by name
- **`generate-service`** - Create business logic services that jobs can use
- **`generate-command`** - Create CLI commands for manual job execution