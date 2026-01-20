---
menu:
    path: ["Commands", "generate-job"]
---
# generate-job Command

## Interface

The command creates a new job with the following signature:

```bash
pinstripe generate-job <name>
```

### Parameters

- **`name`** (required) - The name of the job to create (in snake_case)

### Examples

```bash
# Create a data cleanup job
pinstripe generate-job cleanup_old_data

# Create an email notification job
pinstripe generate-job send_daily_reports

# Create a backup job
pinstripe generate-job database_backup
```

## Description

The `generate-job` command is a **code generation tool** that creates scheduled jobs for your Pinstripe application. This command:

1. **Creates job file** - Generates a new job file in `lib/jobs/`
2. **Sets up scheduling** - Includes cron-style schedule configuration (defaults to every minute)
3. **Provides template** - Creates boilerplate code with meta() and run() methods
4. **Ensures directory structure** - Creates the jobs directory and file importer if needed

## Generated File Structure

```
lib/jobs/
├── _file_importer.js     # Auto-generated importer (created once)
└── job_name.js           # Your new job
```

## Generated Code Template

```javascript
export default {
    meta(){
        this.schedule('* * * * *'); // run every minute
    },

    run(){
        console.log('job-name job coming soon!')
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
- **Auto-creation**: Creates `lib/jobs/` directory if it doesn't exist
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

- **`list-jobs`** - List all available jobs in the project
- **`run-job`** - Execute a specific job by name
- **`generate-service`** - Create business logic services that jobs can use
- **`generate-command`** - Create CLI commands for manual job execution
